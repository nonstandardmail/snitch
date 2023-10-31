export const SESSION_EXPIRING_INACTIVITY_TIME_MSEC = 30 * 60 * 1000 // 30 minutes

import createUniqueId from '../common/create-unique-id'
import {
  BeforeCaptureEventHandler,
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import * as storage from './storage'
import * as utm from './utm'

/**
 * Plugin uses localStorage to persist session’s state
 *
 * New session starts:
 *  1) on init in following cases:
 *    - there is no persisted session
 *    - persisted session is stale
 *    - there is utm parameters in url
 *  2) before any captureEvent call
 *    if persisted session is stale
 */
export default function sessionPlugin(): InitializationHandler &
  BeforeCaptureEventHandler &
  EventPayloadParamsProvider &
  EventSource {
  let captureEvent: EventHandler
  let isLocalStorageSupported: boolean
  let initTimestamp: number

  function isSessionExpired(): boolean {
    return Date.now() - storage.getLastInteractiveEventTS() > SESSION_EXPIRING_INACTIVITY_TIME_MSEC
  }

  function startNewSession() {
    storage.setSessionId(createUniqueId())
    storage.setSessionStartTS(Date.now())
    storage.setSessionUTMParams(utm.stringifyCompact(location.href))
    storage.incrementSessionCount()
    storage.setLastInterctiveEventTS(Date.now())
    captureEvent('sessionStart')
  }

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },

    onInit() {
      initTimestamp = Date.now()
      isLocalStorageSupported = storage.isSupported()
      if (!isLocalStorageSupported) return
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
      if (!isLocalStorageSupported) return
      if (isSessionExpired()) {
        startNewSession()
      }
      storage.setLastInterctiveEventTS(Date.now())
    },

    getEventPayloadParams() {
      if (!isLocalStorageSupported)
        return {
          sid: 'unsupported',
          scnt: '1',
          set: Date.now() - initTimestamp,
          sutm: ''
        }
      return {
        sid: storage.getSessionId() as string,
        scnt: storage.getSessionCount(),
        set: Date.now() - storage.getSessionStartTS(),
        sutm: storage.getSessionUTMParams()
      }
    }
  }
}
