import { INIT_ERROR_NO_TMR_COUNTER, INIT_ERROR_NO_TMR_COUNTER_ID } from './constants'
import createUniqueId from './create-unique-id'
import { Plugin } from './plugins/plugin-interfaces'
import './tmr-counter'

type TrackerInitializationOptions = {
  tmrCounterId: string
  appVersion?: string
  plugins?: Array<Plugin>
}

export type TrackerEventPayload = {
  [key: string]: string | number
}
export default class Tracker {
  private static tmrCounterId: string
  private static appVersion: string
  private static plugins: Array<Plugin>
  public static trackerInstanceId: string

  static init(options: TrackerInitializationOptions): void {
    if (!window._tmr) throw Error(INIT_ERROR_NO_TMR_COUNTER)
    if (!options.tmrCounterId) throw TypeError(INIT_ERROR_NO_TMR_COUNTER_ID)
    this.tmrCounterId = options.tmrCounterId
    this.appVersion = options.appVersion || ''
    this.trackerInstanceId = this.trackerInstanceId || createUniqueId()
    this.plugins = options.plugins || []
    this.callInitializationHandlers()
  }

  private static callInitializationHandlers() {
    this.plugins.forEach(plugin => plugin.onInit?.())
  }

  private static callBeforeCaptureEventHandlers(
    eventName: string,
    eventPayload?: TrackerEventPayload,
    eventValue?: number
  ) {
    this.plugins.forEach(plugin => {
      plugin.beforeCaptureEvent?.(eventName, eventPayload, eventValue)
    })
  }

  private static callEventPayloadProviders(eventPayload: TrackerEventPayload) {
    return this.plugins.reduce(
      (params, plugin) => ({
        ...params,
        ...(plugin.getEventPayloadParams?.() || {})
      }),
      eventPayload
    )
  }

  public static captureEvent(
    eventName: string,
    eventPayload?: TrackerEventPayload,
    eventValue?: number
  ) {
    this.callBeforeCaptureEventHandlers(eventName, eventPayload, eventValue)
    const params = this.callEventPayloadProviders({
      tiid: this.trackerInstanceId,
      ...eventPayload
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
}
