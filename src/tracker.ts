import {
  INIT_ERROR_NO_CONFIG,
  INIT_ERROR_NO_TMR_COUNTER,
  INIT_ERROR_NO_TMR_COUNTER_ID,
  SESSION_EXPIRING_INACTIVITY_TIME_MSEC
} from './constants'
import createSessionId from './create-session-id'
import * as storage from './storage'
import './tmr-counter'
import * as utm from './utm'

type TrackerConfigurationObject = {
  tmrCounterId: string
  appVersion?: string
}

type TrackerEventPayload = {
  [key: string]: string | number
}

export default class Tracker {
  private static config: TrackerConfigurationObject

  static init(config: TrackerConfigurationObject): void {
    if (!window._tmr) throw Error(INIT_ERROR_NO_TMR_COUNTER)
    if (!config) throw TypeError(INIT_ERROR_NO_CONFIG)
    if (!config.tmrCounterId) throw TypeError(INIT_ERROR_NO_TMR_COUNTER_ID)
    this.config = config
    const deviceHadNoSessionsSoFar = storage.getSessionId() === null
    const urlHasUTMParams = utm.urlHasParams(location.href)
    const currentSessionExpired = this.isSessionExpired()
    const shouldStartNewSession =
      deviceHadNoSessionsSoFar || urlHasUTMParams || currentSessionExpired
    if (shouldStartNewSession) return this.startNewSession()
  }

  private static isSessionExpired(): boolean {
    return Date.now() - storage.getLastInteractiveEventTS() > SESSION_EXPIRING_INACTIVITY_TIME_MSEC
  }

  private static startNewSession() {
    storage.setSessionId(createSessionId())
    storage.setSessionEngagementTime(window.performance.now())
    storage.setSessionUTMParams(utm.stringifyCompact(location.href))
    storage.incrementSessionCount()
    storage.setLastInterctiveEventTS(Date.now())
    this.postEvent('sessionStart')
  }

  private static postEvent(
    eventName: string,
    eventPayload: TrackerEventPayload = {},
    eventValue?: number
  ) {
    window._tmr.push({
      id: this.config.tmrCounterId,
      type: 'reachGoal',
      goal: eventName,
      params: {
        href: window.location.href,
        sid: storage.getSessionId() as string,
        scnt: storage.getSessionCount(),
        set: storage.getSessionEngagementTime(),
        sutm: storage.getSessionUTMParams(),
        ...eventPayload
      },
      value: eventValue,
      version: this.config.appVersion || ''
    })
  }

  public static track(eventName: string, eventPayload?: TrackerEventPayload, eventValue?: number) {
    if (this.isSessionExpired()) this.startNewSession()
    this.postEvent(eventName, eventPayload, eventValue)
    storage.setLastInterctiveEventTS(Date.now())
  }
}
