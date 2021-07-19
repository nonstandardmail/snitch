interface EventTracker {
  trackEvent(eventName: string): void
}

export default function engagementTrackerPlugin(
  eventTracker: EventTracker,
  options: { engagementTrackingInterval: number }
) {
  setInterval(() => {
    if (document.hidden === false) {
      eventTracker.trackEvent('engage')
    }
  }, options.engagementTrackingInterval)
}
