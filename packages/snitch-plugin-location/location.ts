import { EventPayloadParamsProvider, InitializationHandler } from '../common/plugin-interfaces'
import listenForLocationChange from './listen-for-location-change'

export default function locationPlugin(
  tracker: {
    captureEvent(eventName: string, eventParams: { phref: string }): void
  },
  captureLocationChanges: boolean = false
): EventPayloadParamsProvider & InitializationHandler {
  return {
    onInit() {
      let currentLocation = window.location.href
      const locationDidChange = () => currentLocation !== window.location.href
      function locationChangeHandler() {
        if (locationDidChange()) {
          tracker.captureEvent('locationChange', { phref: currentLocation })
          currentLocation = window.location.href
        }
      }
      if (captureLocationChanges) {
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
