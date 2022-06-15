import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginSession from '../snitch-plugin-session/session'
import snitchPluginVKBridgeTransport from '../snitch-plugin-vkbridge-transport/vkbridge-transport'
import snitchPluginVKMALaunch from '../snitch-plugin-vkma-launch/vkma-launch'
import createSnitch from '../snitch/index'

export default (options: { initialScreen: Screen }) =>
  createSnitch(
    snitchPluginVKMALaunch(),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScreens(options.initialScreen),
    snitchPluginExceptions(),
    snitchPluginVKBridgeTransport()
  )
