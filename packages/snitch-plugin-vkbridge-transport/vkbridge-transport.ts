import { EventTransport } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import vkBridgeSend from './vkbridge-send'

export const ERROR_NO_VK_BRIDGE = 'initErrorNoVKBridge'

export default function vkbridgeTransportPlugin(): EventTransport {
  return {
    sendEvent(eventName: string, eventParams?: TrackerEventPayload) {
      vkBridgeSend({
        event_name: eventName,
        event_params: eventParams
      })
    }
  }
}
