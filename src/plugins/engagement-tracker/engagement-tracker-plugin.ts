export default function engagementTrackerPlugin(
  tracker: { captureEvent(eventName: string): void },
  options: { engagementTrackingInterval: number }
) {
  setInterval(() => {
    if (document.hidden === false) {
      tracker.captureEvent('engage')
    }
  }, options.engagementTrackingInterval)
}
