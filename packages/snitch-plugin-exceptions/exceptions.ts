import { EventSource, InitializationHandler } from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'

export default function exceptionsPlugin(): InitializationHandler & EventSource {
  let captureEvent: EventHandler

  function captureError(errorEvent: ErrorEvent) {
    captureEvent('uncaughtError', {
      message: errorEvent.message,
      filename: errorEvent.filename,
      lineno: errorEvent.lineno?.toString(),
      colno: errorEvent.colno?.toString(),
      error: errorEvent.error?.toString()
    })
  }

  function captureRejection(rejectionEvent: PromiseRejectionEvent) {
    captureEvent('unhandledRejection', {
      reason: rejectionEvent.reason
    })
  }

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    onInit() {
      window.addEventListener('error', captureError)
      window.addEventListener('unhandledrejection', captureRejection)
    }
  }
}
