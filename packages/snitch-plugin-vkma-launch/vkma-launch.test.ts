import delay from 'delay'
import '../common/testutil/setup-crypto'
import VKMALaunchPlugin from './vkma-launch'

describe('Launch plugin for VKMA platform', () => {
  history.pushState(
    {},
    null,
    '/index.html?vk_access_token_settings=&vk_app_id=7926703&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=mobile_web&vk_ref=other&vk_ts=1632238478&vk_user_id=1094041&sign=123'
  )
  const captureEvent = jest.fn()
  const plugin = VKMALaunchPlugin()

  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('it sends launch event and internal launch on init', async () => {
    await delay(0)
    expect(captureEvent).toHaveBeenCalledWith('launch', {
      ifr: (window.self !== window.top).toString(),
      maane: '0',
      maiau: '0',
      maif: '0',
      mats: '1632238478'
    })
    expect(captureEvent).toHaveBeenCalledWith('mt_internal_launch', {
      customUserId: '1094041'
    })
  })

  it('it provides event params', async () => {
    expect(plugin.getEventPayloadParams().lid).toBeDefined()
    expect(plugin.getEventPayloadParams()).toMatchObject({
      ref: window.document.referrer,
      mauid: '1094041',
      maaid: '7926703',
      malang: 'ru',
      mac: '',
      map: 'mobile_web',
      maref: 'other'
    })
  })
})
