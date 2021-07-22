import { ENGAGEMENT_TRACKING_INTERVAL_MSEC } from '../constants'

export default function engagementPlugin(
  tracker: { captureEvent(eventName: string): void },
  engagementTrackingIntervalMsec: number = ENGAGEMENT_TRACKING_INTERVAL_MSEC
) {
  setInterval(() => {
    if (document.hidden === false) {
      tracker.captureEvent('engage')
    }
  }, engagementTrackingIntervalMsec)
  return {}
}
