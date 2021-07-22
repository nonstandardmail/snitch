import { BeforeCaptureEventHandler, EventPayloadParamsProvider } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-event-payload-type'

type Screen = {
  screenType: string
  screenId?: string
}

export default function screenPlugin(
  initialScreen: Screen
): EventPayloadParamsProvider & BeforeCaptureEventHandler {
  let previousScreen: Screen | null = null
  let currentScreen = initialScreen

  return {
    getEventPayloadParams() {
      return {
        sct: currentScreen.screenType,
        scid: currentScreen.screenId || ''
      }
    },
    beforeCaptureEvent(eventName: string, eventPayload: TrackerEventPayload) {
      if (eventName === 'screenChange') {
        previousScreen = currentScreen
        currentScreen = {
          screenType: eventPayload.screenType as string,
          screenId: eventPayload.screenId as string
        }
        Object.assign(eventPayload, {
          psct: previousScreen.screenType,
          pscid: previousScreen.screenId || ''
        })
        delete eventPayload['screenType']
        delete eventPayload['screenId']
      }
    }
  }
}
