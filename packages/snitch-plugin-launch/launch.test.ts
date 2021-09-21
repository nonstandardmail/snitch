import '../common/testutil/setup-crypto'
import launchPlugin from './launch'

describe('Launch plugin', () => {
  const captureEvent = jest.fn()
  const plugin = launchPlugin()
  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('sends open event on init', () => {
    expect(captureEvent).toHaveBeenCalledWith('launch', {
      ifr: (window.self !== window.top).toString(),
      ref: window.document.referrer
    })
  })

  it('it provides lid event param', async () => {
    expect(plugin.getEventPayloadParams().lid).toBeDefined()
  })
})

describe('Launch plugin for mini-apps', () => {
  history.pushState(
    {},
    null,
    '/index.html?vk_access_token_settings=&vk_app_id=7926703&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=mobile_web&vk_ref=other&vk_ts=1632238478&vk_user_id=1094041&sign=123'
  )
  const captureEvent = jest.fn()
  const plugin = launchPlugin({ trackMiniAppParams: true })

  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('sends open event on init', () => {
    expect(captureEvent).toHaveBeenCalledWith('launch', {
      ifr: (window.self !== window.top).toString(),
      ref: window.document.referrer,
      maane: '0',
      maiau: '0',
      maif: '0',
      map: 'mobile_web',
      mats: '1632238478'
    })
  })

  it('it provides lid event param', async () => {
    expect(plugin.getEventPayloadParams().lid).toBeDefined()
    expect(plugin.getEventPayloadParams()).toMatchObject({
      mauid: '1094041',
      maaid: '7926703',
      malang: 'ru',
      mac: '',
      maref: 'other'
    })
  })
})
