import { EventTransport } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import vkBridgeSend from './vkbridge-send'

export const ERROR_NO_VK_BRIDGE = 'initErrorNoVKBridge'

export default function vkbridgeTransportPlugin(): EventTransport {
  const url = new URL(location.href)
  const vkUserId = url.searchParams.get('vk_user_id') || 'anonymous'
  return {
    sendEvent(eventName: string, eventParams?: TrackerEventPayload) {
      /*
        For some reason VKBridge for iOS native clients
        does not send events with numeric values in params
        so we have to convert all no-nstring params to strings
      */
      if (eventParams) {
        for (const paramKey of Object.keys(eventParams)) {
          if (eventParams[paramKey] === null) eventParams[paramKey] = 'null'
          if (eventParams[paramKey] === undefined) eventParams[paramKey] = 'undefined'
          if (typeof eventParams[paramKey] !== 'string')
            eventParams[paramKey] = eventParams[paramKey].toString()
        }
      }
      vkBridgeSend('VKWebAppTrackEvent', {
        custom_user_id: vkUserId,
        event_name: eventName,
        event_params: eventParams
      })
      vkBridgeSend('VKWebAppSendCustomEvent', {
        event: eventName,
        json: JSON.stringify(eventParams)
      })
    }
  }
}
