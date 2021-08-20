import { EventSource, InitializationHandler } from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'

const DEFAULT_ENGAGEMENT_TRACKING_INTERVAL_MSEC = 10 * 1000 // 10 seconds

export default function engagementPlugin({
  engagementTrackingIntervalMsec = DEFAULT_ENGAGEMENT_TRACKING_INTERVAL_MSEC
}: {
  engagementTrackingIntervalMsec: number
}): InitializationHandler & EventSource {
  let captureEvent: EventHandler

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },

    onInit() {
      setInterval(() => {
        if (document.hidden === false) captureEvent('engage')
      }, engagementTrackingIntervalMsec)
    }
  }
}
