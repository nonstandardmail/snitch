import { BeforeCaptureEventHandler, InitializationHandler } from '../common/plugin-interfaces'
import { TrackerEventPayload, TrackerInitializationOptions } from '../common/tracker-interfaces'
export default function engagementPlugin(): InitializationHandler & BeforeCaptureEventHandler {
  let lastLogTS: number | null = null
  function logLine(message: string) {
    const now = new Date()
    console.log(
      `%c[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]${
        lastLogTS ? ` (+${Math.floor((now.getTime() - (lastLogTS as number)) / 1e3)}s)` : ''
      } %cSnitch: %c${message}`,
      'color: gray',
      'color: black',
      'font-weight: bold'
    )
    lastLogTS = now.getTime()
  }
  return {
    onInit(options: TrackerInitializationOptions) {
      logLine('init called with options:')
      console.table(options)
    },

    beforeCaptureEvent(eventName: string, eventPayload: TrackerEventPayload) {
      logLine(`captured event '${eventName}'`)
      if (eventPayload && Object.keys(eventPayload).length !== 0) console.table(eventPayload)
    }
  }
}
