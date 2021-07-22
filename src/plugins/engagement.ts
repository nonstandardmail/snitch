export default function engagementPlugin(
  tracker: { captureEvent(eventName: string): void },
  options: { engagementTrackingIntervalMsec: number }
) {
  setInterval(() => {
    if (document.hidden === false) {
      tracker.captureEvent('engage')
    }
  }, options.engagementTrackingIntervalMsec)
  return {}
}
