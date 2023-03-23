import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginFlag from '../snitch-plugin-flag/flag'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginSession from '../snitch-plugin-session/session'
import snitchPluginVKBridgeTransport from '../snitch-plugin-vkbridge-transport/vkbridge-transport'
import snitchPluginVKMALaunch from '../snitch-plugin-vkma-launch/vkma-launch'
import createSnitch from '../snitch/index'

export default (options: { initialScreen: Screen; flagApiEndpoint?: string }) =>
  createSnitch(
    snitchPluginVKMALaunch(),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScreens(options.initialScreen),
    snitchPluginExceptions(),
    snitchPluginFlag({ flagApiEndpoint: options.flagApiEndpoint || '/' }),
    snitchPluginVKBridgeTransport()
  )
