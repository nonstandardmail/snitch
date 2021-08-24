import createSnitch from '../snitch'
import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginLaunch from '../snitch-plugin-launch/launch'
import snitchPluginLocation from '../snitch-plugin-location/location'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginSession from '../snitch-plugin-session/session'
import { VKBridge } from '../snitch-plugin-vkbridge-transport/vkbridge'
import snitchPluginVKBridgeTransport from '../snitch-plugin-vkbridge-transport/vkbridge-transport'
import snitchPluginWebVitals from '../snitch-plugin-web-vitals/web-vitals'

export default (options: { vkBridge: VKBridge; initialScreen: Screen }) =>
  createSnitch(
    snitchPluginLaunch(),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginLocation({
      captureLocationChange: false,
      getLocation: () => window.location.href.replace(/sign=[A-z0-9]+(&|$)/, '')
    }),
    snitchPluginScreens(options.initialScreen),
    snitchPluginExceptions(),
    snitchPluginWebVitals(),
    snitchPluginVKBridgeTransport(options.vkBridge)
  )
