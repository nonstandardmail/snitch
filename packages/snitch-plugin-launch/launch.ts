import createUniqueId from '../common/create-unique-id'
import { EventPayloadParamsProvider, InitializationHandler } from '../common/plugin-interfaces'

export default function locationPlugin(tracker: {
  captureEvent(eventName: string, eventParams: { ref: string; ifr: string }): void
}): InitializationHandler & EventPayloadParamsProvider {
  const launchId = createUniqueId()
  return {
    getEventPayloadParams() {
      return {
        lid: launchId
      }
    },
    onInit() {
      tracker.captureEvent('launch', {
        ref: document.referrer,
        ifr: (window.self !== window.top).toString()
      })
    }
  }
}
