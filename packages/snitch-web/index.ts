import snitchPluginEngagement from '../snitch-plugin-engagement/engagement'
import snitchPluginExceptions from '../snitch-plugin-exceptions/exceptions'
import snitchPluginFlag from '../snitch-plugin-flag/flag'
import snitchPluginLaunch from '../snitch-plugin-launch/launch'
import snitchPluginLocation from '../snitch-plugin-location/location'
import snitchPluginScreens, { Screen } from '../snitch-plugin-screens/screens'
import snitchPluginScroll from '../snitch-plugin-scroll/scroll'
import snitchPluginSession from '../snitch-plugin-session/session'
import snitchPluginTOPMailruTransport from '../snitch-plugin-topmailru-transport/topmailru-transport'
import snitchPluginWebVitals from '../snitch-plugin-web-vitals/web-vitals'
import createSnitch from '../snitch/index'

export default (options: {
  topmailruCounterId: string
  initialScreen?: Screen
  userIdResolver?: () => string | null | undefined
  flagApiEndpoint?: string
}) =>
  createSnitch(
    snitchPluginLaunch(),
    snitchPluginSession(),
    snitchPluginEngagement(),
    snitchPluginScroll(),
    snitchPluginLocation({ captureLocationChange: true }),
    snitchPluginScreens(options.initialScreen || { screenType: 'undefined' }),
    snitchPluginExceptions(),
    snitchPluginWebVitals(),
    snitchPluginFlag({
      userIdResolver: options.userIdResolver,
      flagApiEndpoint: options.flagApiEndpoint || '/'
    }),
    snitchPluginTOPMailruTransport(options.topmailruCounterId, options.userIdResolver)
  )
