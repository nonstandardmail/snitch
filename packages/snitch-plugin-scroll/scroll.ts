import {
  BeforeCaptureEventHandler,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import listenForScrollChange, { clearScrollDepthsCache } from './listen-for-scroll-change'

export default function scrollPlugin(): InitializationHandler &
  EventSource &
  BeforeCaptureEventHandler {
  let captureEvent: EventHandler
  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    onInit() {
      listenForScrollChange((scrollDepth: number) =>
        captureEvent('scroll', { depthPercent: scrollDepth })
      )
    },
    beforeCaptureEvent(eventName) {
      if (eventName === 'locationChange' || eventName === 'screenChange') {
        clearScrollDepthsCache()
      }
    }
  }
}
