import {
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import listenForLocationChange from './listen-for-location-change'

export default function locationPlugin({
  captureLocationChange = false
}: {
  captureLocationChange: boolean
}): EventPayloadParamsProvider & InitializationHandler & EventSource {
  let captureEvent: EventHandler
  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    onInit() {
      let currentLocation = window.location.href
      const locationDidChange = () => currentLocation !== window.location.href
      function locationChangeHandler() {
        if (locationDidChange()) {
          captureEvent('locationChange', { phref: currentLocation })
          currentLocation = window.location.href
        }
      }
      if (captureLocationChange) {
        listenForLocationChange(locationChangeHandler)
      }
    },
    getEventPayloadParams() {
      return {
        href: window.location.href
      }
    }
  }
}
