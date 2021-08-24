import {
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import listenForLocationChange from './listen-for-location-change'

type LocationGetter = () => string

export default function locationPlugin(options: {
  captureLocationChange: boolean
  getLocation?: LocationGetter
}): EventPayloadParamsProvider & InitializationHandler & EventSource {
  let captureEvent: EventHandler
  const getCurrentLocation = () => options.getLocation?.() || window.location.href
  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    onInit() {
      let currentLocation = getCurrentLocation()
      const locationDidChange = () => currentLocation !== getCurrentLocation()
      function locationChangeHandler() {
        if (locationDidChange()) {
          captureEvent('locationChange', { phref: currentLocation })
          currentLocation = getCurrentLocation()
        }
      }
      if (options.captureLocationChange) {
        listenForLocationChange(locationChangeHandler)
      }
    },
    getEventPayloadParams() {
      return {
        href: getCurrentLocation()
      }
    }
  }
}
