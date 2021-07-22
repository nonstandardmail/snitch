import { SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from '../constants'
import createUniqueId from '../create-unique-id'
import * as storage from '../storage'
import * as utm from '../utm'
import {
  BeforeCaptureEventHandler,
  EventPayloadParamsProvider,
  InitializationHandler
} from './plugin-interfaces'
/**
 * New session starts:
 *  - on init if:
 *    - there is no persisted session
 *    - persisted session is stale
 *    - there is utm parameters in url
 *  - before any tracker's captureEvent call if:
 *    - persisted session is stale
 */
export default function sessionPlugin(tracker: {
  captureEvent(eventName: string, eventPayload?: { phref: string }): void
}): InitializationHandler & BeforeCaptureEventHandler & EventPayloadParamsProvider {
  function isSessionExpired(): boolean {
    return Date.now() - storage.getLastInteractiveEventTS() > SESSION_EXPIRING_INACTIVITY_TIME_MSEC
  }

  function startNewSession() {
    storage.setSessionId(createUniqueId())
    storage.setSessionStartTS(Date.now())
    storage.setSessionUTMParams(utm.stringifyCompact(location.href))
    storage.incrementSessionCount()
    storage.setLastInterctiveEventTS(Date.now())
    tracker.captureEvent('sessionStart')
  }

  return {
    onInit() {
      const deviceHadNoSessionsSoFar = storage.getSessionId() === null
      const urlHasUTMParams = utm.urlHasParams(window.location.href)
      const currentSessionExpired = isSessionExpired()
      const shouldStartNewSession =
        deviceHadNoSessionsSoFar || urlHasUTMParams || currentSessionExpired
      if (shouldStartNewSession) {
        startNewSession()
      }
    },

    beforeCaptureEvent() {
      if (isSessionExpired()) {
        startNewSession()
      }
      storage.setLastInterctiveEventTS(Date.now())
    },

    getEventPayloadParams() {
      return {
        sid: storage.getSessionId() as string,
        scnt: storage.getSessionCount(),
        set: Date.now() - storage.getSessionStartTS(),
        sutm: storage.getSessionUTMParams()
      }
    }
  }
}
