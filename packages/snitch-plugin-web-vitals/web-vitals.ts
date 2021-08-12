import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric } from 'web-vitals'
import { InitializationHandler } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'

export default function exceptionsPlugin(tracker: {
  captureEvent(eventName: string, eventParams: TrackerEventPayload): void
}): InitializationHandler {
  function reportWebVitalMetric(metric: Metric) {
    tracker.captureEvent('webVital', {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      metricId: metric.id
    })
  }
  const trackedMetricsGetters = [getCLS, getFID, getLCP, getTTFB, getFCP]
  return {
    onInit() {
      trackedMetricsGetters.forEach(getMetric => getMetric(reportWebVitalMetric))
    }
  }
}
