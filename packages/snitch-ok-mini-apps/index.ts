import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginLocation from '../snitch-plugin-location/location'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginScroll from '../snitch-plugin-scroll/scroll'
import snitchPluginSession from '../snitch-plugin-session/session'
import snitchPluginTOPMailruTransport from '../snitch-plugin-topmailru-transport/topmailru-transport'
import snitchPluginVKMALaunch from '../snitch-plugin-vkma-launch/vkma-launch'
import createSnitch from '../snitch/index'

export default (options: { topmailruCounterId: string; initialScreen?: Screen }) =>
  createSnitch(
    snitchPluginVKMALaunch(),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScroll(),
    snitchPluginLocation({ captureLocationChange: true }),
    snitchPluginScreens(options.initialScreen || { screenType: 'undefined' }),
    snitchPluginExceptions(),
    snitchPluginTOPMailruTransport(options.topmailruCounterId)
  )
