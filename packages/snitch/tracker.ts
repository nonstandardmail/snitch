import createUniqueId from '../common/create-unique-id'
import { Plugin } from '../common/plugin-interfaces'
import { TrackerEventPayload, TrackerInitializationOptions } from '../common/tracker-interfaces'

export default class Tracker {
  private static plugins: Array<Plugin>
  public static trackerInstanceId: string

  static init(options: TrackerInitializationOptions): void {
    this.trackerInstanceId = this.trackerInstanceId || createUniqueId()
    this.plugins = options.plugins || []
    this.callInitializationHandlers(options)
  }

  private static callInitializationHandlers(initializationOptions: TrackerInitializationOptions) {
    this.plugins.forEach(plugin => plugin.onInit?.(initializationOptions))
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

  private static callEventPayloadParamsProviders(eventPayload: TrackerEventPayload) {
    return this.plugins.reduce(
      (params, plugin) => ({
        ...params,
        ...(plugin.getEventPayloadParams?.() || {})
      }),
      eventPayload
    )
  }

  private static callTransports(
    eventName: string,
    eventPayload?: TrackerEventPayload,
    eventValue?: number
  ) {
    this.plugins.forEach(plugin => {
      plugin.sendEvent?.(eventName, eventPayload, eventValue)
    })
  }

  public static captureEvent(
    eventName: string,
    eventPayload?: TrackerEventPayload,
    eventValue?: number
  ) {
    this.callBeforeCaptureEventHandlers(eventName, eventPayload, eventValue)
    this.callTransports(
      eventName,
      this.callEventPayloadParamsProviders({
        tiid: this.trackerInstanceId,
        ...eventPayload
      }),
      eventValue
    )
  }
}
