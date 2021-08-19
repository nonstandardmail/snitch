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

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    getEventPayloadParams() {
      return {
        lid: launchId
      }
    },
    onInit() {
      captureEvent('launch', {
        ref: document.referrer,
        ifr: (window.self !== window.top).toString()
      })
    }
  }
}
