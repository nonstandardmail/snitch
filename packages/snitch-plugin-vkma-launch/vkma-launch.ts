import createUniqueId from '../common/create-unique-id'
import {
  EventPayloadParamsProvider,
  EventSource,
  InitializationHandler
} from '../common/plugin-interfaces'
import { EventHandler } from '../common/tracker-interfaces'
import VKMALaunchParams from './vkma-launch-params'

export default function VKMALaunchPlugin(): InitializationHandler &
  EventPayloadParamsProvider &
  EventSource {
  let captureEvent: EventHandler
  const launchId = createUniqueId()
  const referrer = window.document.referrer
  const miniAppEventProviderParams = VKMALaunchParams.eventProviderParams(location.href)

  return {
    setEventHandler(eventHandler: EventHandler) {
      captureEvent = eventHandler
    },
    getEventPayloadParams() {
      return {
        lid: launchId,
        ref: referrer,
        ...miniAppEventProviderParams
      }
    },
    onInit() {
      const miniAppLaunchEventParams = VKMALaunchParams.launchEventParams(location.href)

      setTimeout(() => {
        captureEvent('launch', {
          ifr: (window.self !== window.top).toString(),
          ...miniAppLaunchEventParams
        })
        captureEvent('mt_internal_launch', {
          customUserId: miniAppEventProviderParams['mauid']
        })
      }, 0)
    }
  }
}
