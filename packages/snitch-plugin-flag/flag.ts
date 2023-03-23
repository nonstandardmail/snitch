import { getAnonymousUserId } from '../common/anonymous-id-store'
import { EventSource, MixinProvider } from '../common/plugin-interfaces'
import { getTMRCounterUserId } from '../common/tmr'
import { EventHandler } from '../common/tracker-interfaces'
import flagServiceFactory, { EvaluationResponse } from './flag-service'

interface Flag {
  flagKey: string
  match: boolean
  variant: string
  attachment: string
}

export default function flagPlugin(options: {
  flagApiEndpoint: string
  userIdResolver?: () => string | null | undefined
}): MixinProvider & EventSource {
  const flagService = flagServiceFactory(options.flagApiEndpoint)
  const url = new URL(location.href)
  const vkUserId = url.searchParams.get('vk_user_id')
  const getEntityId = (): string => {
    const entityId =
      (options.userIdResolver && options.userIdResolver()) ||
      vkUserId ||
      getTMRCounterUserId() ||
      getAnonymousUserId()
    if (!entityId) throw Error('Flag evaluation without entityId is not possible')
    return entityId
  }

  let captureEvent: EventHandler

  function captureEvaluationEvent(flagEvaluation: EvaluationResponse) {
    captureEvent('flagEvaluationComplete', {
      ...flagEvaluation,
      requestContext: JSON.stringify(flagEvaluation.requestContext),
      match: flagEvaluation.match.toString(),
      timestamp: flagEvaluation.timestamp.toString()
    })
  }

  function captureEvaluationFailureEvent(flagKey: string, errorMessage: string) {
    captureEvent('flagEvaluationFailed', {
      flagKey,
      errorMessage
    })
  }

  const flagEvaluationToSimpleFlag = (flagEvaluationResponse: EvaluationResponse) => ({
    flagKey: flagEvaluationResponse.flagKey,
    match: flagEvaluationResponse.match,
    variant: flagEvaluationResponse.value,
    attachment: flagEvaluationResponse.attachment
  })

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    getMixins() {
      return {
        getFlag: async (flagKey: string, context?: Record<string, string>): Promise<Flag> => {
          const entityId = getEntityId()

          try {
            var flagEvaluationResponse = await flagService.evaluateFlag({
              entityId,
              flagKey,
              context: { customUserId: entityId, ...context }
            })
          } catch (error) {
            captureEvaluationFailureEvent(flagKey, (error as Error).message)
            throw error
          }

          captureEvaluationEvent(flagEvaluationResponse)
          return flagEvaluationToSimpleFlag(flagEvaluationResponse)
        },
        getFlags: async (flagKeys: string[], context?: Record<string, string>): Promise<Flag[]> => {
          const entityId = getEntityId()

          try {
            var flagEvaluations = await flagService.evaluateFlagBatch(
              flagKeys.map(flagKey => ({
                entityId,
                flagKey,
                context: { customUserId: entityId, ...context }
              }))
            )
          } catch (error) {
            flagKeys.forEach(flagKey => {
              captureEvaluationFailureEvent(flagKey, (error as Error).message)
            })
            throw error
          }

          flagEvaluations.response.forEach(captureEvaluationEvent)
          return flagEvaluations.response.map(flagEvaluationToSimpleFlag)
        }
      }
    }
  }
}
