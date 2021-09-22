import createSnitch from '../snitch'
import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginLaunch from '../snitch-plugin-launch/launch'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginSession from '../snitch-plugin-session/session'
import { VKBridge } from '../snitch-plugin-vkbridge-transport/vkbridge'
import snitchPluginVKBridgeTransport from '../snitch-plugin-vkbridge-transport/vkbridge-transport'
import snitchPluginWebVitals from '../snitch-plugin-web-vitals/web-vitals'

export default (options: { vkBridge: VKBridge; initialScreen: Screen }) =>
  createSnitch(
    snitchPluginLaunch({ trackMiniAppParams: true }),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScreens(options.initialScreen),
    snitchPluginExceptions(),
    snitchPluginWebVitals(),
    snitchPluginVKBridgeTransport(options.vkBridge)
  )
