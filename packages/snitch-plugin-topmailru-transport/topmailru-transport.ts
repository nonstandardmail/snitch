import * as anonymousUserIdStore from '../common/anonymous-id-store'
import createUniqueId from '../common/create-unique-id'
import { EventTransport, InitializationHandler } from '../common/plugin-interfaces'
import '../common/tmr'
import { getTMRCounterUserId } from '../common/tmr'
import { TrackerEventPayload } from '../common/tracker-interfaces'

export const ERROR_NO_TMR_COUNTER_ID = 'initErrorNoTMRCounterId'

export default function tmrTransportPlugin(
  topmailruCounterId: string,
  userIdResolver?: () => string | null | undefined
): EventTransport & InitializationHandler {
  if (!topmailruCounterId) throw TypeError(ERROR_NO_TMR_COUNTER_ID)

  const getAnonymousUserId = (): string => {
    let anonymousUserId = anonymousUserIdStore.getAnonymousUserId()
    if (anonymousUserId === null) {
      anonymousUserId = `${createUniqueId()}@anonymous`
      anonymousUserIdStore.setAnonymousUserId(anonymousUserId)
    }
    return anonymousUserId
  }

  return {
    onInit() {
      if (!window._tmr) window._tmr = []
    },

    sendEvent(eventName: string, eventParams?: TrackerEventPayload) {
      window._tmr.push({
        id: topmailruCounterId,
        type: 'reachGoal',
        goal: eventName,
        params: eventParams,
        userid:
          (userIdResolver && userIdResolver()) || getTMRCounterUserId() || getAnonymousUserId()
      })
    }
  }
}
