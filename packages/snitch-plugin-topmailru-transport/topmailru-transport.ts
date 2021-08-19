import { EventTransport, InitializationHandler } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import './_tmr'

export const ERROR_NO_TMR_COUNTER_ID = 'initErrorNoTMRCounterId'

export default function tmrTransportPlugin(
  topmailruCounterId: string
): EventTransport & InitializationHandler {
  if (!topmailruCounterId) throw TypeError(ERROR_NO_TMR_COUNTER_ID)
  return {
    onInit() {
      if (!window._tmr) window._tmr = []
    },

    sendEvent(eventName: string, eventParams?: TrackerEventPayload) {
      window._tmr.push({
        id: topmailruCounterId,
        type: 'reachGoal',
        goal: eventName,
        params: eventParams
      })
    }
  }
}
