import listenForLocationChange from '../listen-for-location-change'
import { InitializationHandler, ParamsProvider } from './plugin-interfaces'

export default function locationPlugin(tracker: {
  captureEvent(eventName: string, eventParams: { phref: string }): void
}): ParamsProvider & InitializationHandler {
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
      listenForLocationChange(locationChangeHandler)
    },
    getEventParams() {
      return {
        href: window.location.href
      }
    }
  }
}
