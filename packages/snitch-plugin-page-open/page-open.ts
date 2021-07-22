import createUniqueId from '../common/create-unique-id'
import { EventPayloadParamsProvider, InitializationHandler } from '../common/plugin-interfaces'

export default function locationPlugin(tracker: {
  captureEvent(eventName: string, eventParams: { ref: string; ifr: string }): void
}): InitializationHandler & EventPayloadParamsProvider {
  const openId = createUniqueId()
  return {
    getEventPayloadParams() {
      return {
        oid: openId
      }
    },
    onInit() {
      tracker.captureEvent('open', {
        ref: document.referrer,
        ifr: (window.self !== window.top).toString()
      })
    }
  }
}
