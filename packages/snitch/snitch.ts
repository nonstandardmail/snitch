import { Plugin } from '../common/plugin-interfaces'
import { TrackerEventPayload } from '../common/tracker-interfaces'
import usePlugins from './use-plugins'

export default (...args: Array<Plugin>) => {
  const plugins = usePlugins(args)

  const captureEvent = (eventName: string, eventPayload?: TrackerEventPayload) => {
    plugins.callBeforeCaptureEventHandlers(eventName, eventPayload)
    plugins.callTransports(
      eventName,
      plugins.callEventPayloadParamsProviders({
        ...eventPayload
      })
    )
  }

  plugins.setEventHandler(captureEvent)
  plugins.callInitializationHandlers()
  plugins.applyMixins(captureEvent)
  return captureEvent
}
