import createUniqueId from '../common/create-unique-id'
import { EventTransport, InitializationHandler } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import * as storage from './storage'
import './_tmr'
import { TMRCounter, UninitializedTMRCounter } from './_tmr'

export const ERROR_NO_TMR_COUNTER_ID = 'initErrorNoTMRCounterId'

export default function tmrTransportPlugin(
  topmailruCounterId: string,
  userIdResolver?: () => string | null | undefined
): EventTransport & InitializationHandler {
  if (!topmailruCounterId) throw TypeError(ERROR_NO_TMR_COUNTER_ID)

  const getAnonymousUserId = (): string => {
    let anonymousUserId = storage.getAnonymousUserId()
    if (anonymousUserId === null) {
      anonymousUserId = `${createUniqueId()}@anonymous`
      storage.setAnonymousUserId(anonymousUserId)
    }
    return anonymousUserId
  }

  const getTMRCounterUserId = () => {
    const _tmr = window._tmr as TMRCounter
    if (_tmr.getUserID) return _tmr.getUserID()
    const userId = (window._tmr as UninitializedTMRCounter).reduce((userId, eventCandidate) => {
      if (eventCandidate.type === 'setUserID') return eventCandidate.userid
      return userId
    }, '')
    return userId || null
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
