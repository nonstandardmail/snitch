import createUniqueId from '../common/create-unique-id'
import {
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'

export default function launchPlugin(): InitializationHandler &
  EventPayloadParamsProvider &
  EventSource {
  let captureEvent: EventHandler
  const launchId = createUniqueId()
  const referrer = window.document.referrer
  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    getEventPayloadParams() {
      return {
        lid: launchId,
        ref: referrer
      }
    },
    onInit() {
      setTimeout(
        () =>
          captureEvent('launch', {
            ifr: (window.self !== window.top).toString()
          }),
        0
      )
    }
  }
}
