import { EventTransport } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import { VKBridge } from './vkbridge'

export const ERROR_NO_VK_BRIDGE = 'initErrorNoVKBridge'

export default function vkbridgeTransportPlugin(bridge: VKBridge): EventTransport {
  if (!bridge) throw TypeError(ERROR_NO_VK_BRIDGE)
  return {
    sendEvent(eventName: string, eventParams?: TrackerEventPayload) {
      bridge.send('VKWebAppTrackEvent', {
        event_name: eventName,
        event_params: eventParams
      })
    }
  }
}
