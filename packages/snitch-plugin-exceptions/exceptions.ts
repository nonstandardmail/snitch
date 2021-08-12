import { InitializationHandler } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'

export default function exceptionsPlugin(tracker: {
  captureEvent(eventName: string, eventParams: TrackerEventPayload): void
}): InitializationHandler {
  function captureError(errorEvent: ErrorEvent) {
    tracker.captureEvent('uncaughtError', {
      message: errorEvent.message,
      filename: errorEvent.filename,
      lineno: errorEvent.lineno?.toString(),
      colno: errorEvent.colno?.toString(),
      error: errorEvent.error?.toString()
    })
  }

  function captureRejection(rejectionEvent: PromiseRejectionEvent) {
    tracker.captureEvent('unhandledRejection', {
      reason: rejectionEvent.reason
    })
  }

  return {
    onInit() {
      window.addEventListener('error', captureError)
      window.addEventListener('unhandledrejection', captureRejection)
    }
  }
}
