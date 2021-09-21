import createUniqueId from '../common/create-unique-id'
import {
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import miniAppsLaunchParams from './mini-apps-launch-params'

export default function launchPlugin(options?: {
  trackMiniAppParams?: boolean
}): InitializationHandler & EventPayloadParamsProvider & EventSource {
  const shouldTrackMiniAppParams = !!options && options.trackMiniAppParams
  let captureEvent: EventHandler
  const launchId = createUniqueId()
  const miniAppEventProviderParams = shouldTrackMiniAppParams
    ? miniAppsLaunchParams.eventProviderParams(location.href)
    : {}
  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    getEventPayloadParams() {
      return {
        lid: launchId,
        ...miniAppEventProviderParams
      }
    },
    onInit() {
      const miniAppLaunchEventParams = shouldTrackMiniAppParams
        ? miniAppsLaunchParams.launchEventParams(location.href)
        : {}
      captureEvent('launch', {
        ref: document.referrer,
        ifr: (window.self !== window.top).toString(),
        ...miniAppLaunchEventParams
      })
    }
  }
}
