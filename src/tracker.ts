import {
  ERROR_SCREEN_TRACKING_DISABLED,
  INIT_ERROR_NO_TMR_COUNTER,
  INIT_ERROR_NO_TMR_COUNTER_ID,
  SESSION_EXPIRING_INACTIVITY_TIME_MSEC
} from './constants'
import createUniqueId from './create-unique-id'
import * as storage from './storage'
import './tmr-counter'
import * as utm from './utm'

type TrackerInitializationParams = {
  tmrCounterId: string
  appVersion?: string
  currentScreen?: { screenType: string; screenId?: string }
}

type TrackerEventPayload = {
  [key: string]: string | number
}
type ScreenInfo = {
  screenType: string
  screenId: string
}

const defaultScreen: ScreenInfo = { screenType: '', screenId: '' }
export default class Tracker {
  private static tmrCounterId: string
  private static appVersion: string
  private static screenTrackingEnabled: boolean = false
  private static currentScreen: ScreenInfo = defaultScreen
  private static previousScreen: ScreenInfo = defaultScreen
  public static trackerInstanceId: string

  static init(options: TrackerInitializationParams): void {
    if (!window._tmr) throw Error(INIT_ERROR_NO_TMR_COUNTER)
    if (!options.tmrCounterId) throw TypeError(INIT_ERROR_NO_TMR_COUNTER_ID)
    this.tmrCounterId = options.tmrCounterId
    this.appVersion = options.appVersion || ''
    this.screenTrackingEnabled = !!options.currentScreen
    if (this.screenTrackingEnabled)
      this.currentScreen = Object.assign({}, this.currentScreen, options.currentScreen)
    this.trackerInstanceId = this.trackerInstanceId || createUniqueId()
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
    storage.setSessionId(createUniqueId())
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
    const params = {
      tiid: this.trackerInstanceId,
      href: window.location.href,
      sid: storage.getSessionId() as string,
      scnt: storage.getSessionCount(),
      set: storage.getSessionEngagementTime(),
      sutm: storage.getSessionUTMParams(),
      ...eventPayload
    }
    if (this.screenTrackingEnabled)
      Object.assign(params, {
        sct: this.currentScreen.screenType,
        scid: this.currentScreen.screenId,
        psct: this.previousScreen.screenType,
        pscid: this.previousScreen.screenId
      })
    window._tmr.push({
      id: this.tmrCounterId,
      type: 'reachGoal',
      goal: eventName,
      params,
      value: eventValue,
      version: this.appVersion || ''
    })
  }

  public static track(eventName: string, eventPayload?: TrackerEventPayload, eventValue?: number) {
    if (this.isSessionExpired()) this.startNewSession()
    this.postEvent(eventName, eventPayload, eventValue)
    storage.setLastInterctiveEventTS(Date.now())
  }

  public static setCurrentScreen(screenType: string, screenId: string = '') {
    if (!this.screenTrackingEnabled) {
      throw Error(ERROR_SCREEN_TRACKING_DISABLED)
    }
    this.previousScreen = this.currentScreen
    this.currentScreen = { screenType, screenId }
    this.track('screenChange')
  }
}
