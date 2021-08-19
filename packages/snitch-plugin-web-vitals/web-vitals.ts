import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric } from 'web-vitals'
import { EventSource, InitializationHandler } from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'

export default function exceptionsPlugin(): InitializationHandler & EventSource {
  let captureEvent: EventHandler

  function reportWebVitalMetric(metric: Metric) {
    captureEvent('webVital', {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      metricId: metric.id
    })
  }

  const trackedMetricsGetters = [getCLS, getFID, getLCP, getTTFB, getFCP]

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },

    onInit() {
      trackedMetricsGetters.forEach(getMetric => getMetric(reportWebVitalMetric))
    }
  }
}
