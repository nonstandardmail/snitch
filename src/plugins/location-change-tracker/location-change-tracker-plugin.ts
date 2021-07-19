import listenForLocationChange from '../../listen-for-location-change'

export default function locationChangeTrackerPlugin(eventTracker: {
  captureEvent(eventName: string, eventParams: { phref: string }): void
}) {
  let currentLocation = window.location.href
  const locationDidChange = () => currentLocation !== window.location.href
  function locationChangeHandler() {
    if (locationDidChange()) {
      eventTracker.captureEvent('locationChange', { phref: currentLocation })
      currentLocation = window.location.href
    }
  }
  listenForLocationChange(locationChangeHandler)
}
