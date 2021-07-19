import listenForLocationChange from '../../listen-for-location-change'

interface EventTracker {
  trackEvent(eventName: string, eventParams: { phref: string }): void
}

export default function locationChangeTrackerPlugin(eventTracker: EventTracker) {
  let currentLocation = window.location.href
  const locationDidChange = () => currentLocation !== window.location.href
  function locationChangeHandler() {
    if (locationDidChange()) {
      eventTracker.trackEvent('locationChange', { phref: currentLocation })
      currentLocation = window.location.href
    }
  }
  listenForLocationChange(locationChangeHandler)
}
