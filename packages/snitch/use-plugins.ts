import { Plugin } from '../common/plugin-interfaces'
import { EventHandler, TrackerEventPayload } from '../common/tracker-interfaces'

export default (plugins: Array<Plugin>) => ({
  callBeforeCaptureEventHandlers(eventName: string, eventPayload?: TrackerEventPayload) {
    plugins.forEach(plugin => {
      plugin.beforeCaptureEvent?.(eventName, eventPayload)
    })
  },

  callEventPayloadParamsProviders(eventPayload: TrackerEventPayload) {
    return plugins.reduce(
      (params, plugin) => ({
        ...params,
        ...(plugin.getEventPayloadParams?.() || {})
      }),
      eventPayload
    )
  },

  callTransports(eventName: string, eventPayload?: TrackerEventPayload) {
    plugins.forEach(plugin => {
      plugin.sendEvent?.(eventName, eventPayload)
    })
  },

  callInitializationHandlers() {
    plugins.forEach(plugin => plugin.onInit?.())
  },

  setEventHandler(eventHandler: EventHandler) {
    plugins.forEach(plugin => plugin.setEventHandler?.(eventHandler))
  },

  applyMixins(eventHandler: EventHandler) {
    Object.setPrototypeOf(
      eventHandler,
      plugins.reduce((mixins: Record<string, Function>, plugin) => {
        if (plugin.getMixins) {
          return { ...mixins, ...plugin.getMixins() }
        }
        return mixins
      }, {})
    )
  }
})
