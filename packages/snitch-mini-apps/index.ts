import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginLaunch from '../snitch-plugin-launch/launch'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginSession from '../snitch-plugin-session/session'
import snitchPluginVKBridgeTransport from '../snitch-plugin-vkbridge-transport/vkbridge-transport'
import createSnitch from '../snitch/index'

export default (options: { initialScreen: Screen }) =>
  createSnitch(
    snitchPluginLaunch({ trackMiniAppParams: true }),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScreens(options.initialScreen),
    snitchPluginExceptions(),
    snitchPluginVKBridgeTransport()
  )
