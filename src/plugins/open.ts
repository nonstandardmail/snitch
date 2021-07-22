import createUniqueId from '../create-unique-id'
import { InitializationHandler, ParamsProvider } from './plugin-interfaces'

export default function locationPlugin(tracker: {
  captureEvent(eventName: string, eventParams: { ref: string; ifr: string }): void
}): InitializationHandler & ParamsProvider {
  const openId = createUniqueId()
  return {
    getEventParams() {
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
