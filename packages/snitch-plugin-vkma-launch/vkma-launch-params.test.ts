import miniAppsLaunchParams from './vkma-launch-params'
const vkMiniAppTestURL =
  'https://vk-prod.app1.com/index.html?vk_access_token_settings=&vk_app_id=7926703&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=mobile_web&vk_ref=other&vk_ts=1632238478&vk_user_id=1094041&sign=123'

describe('mini apps launch params readers', () => {
  it('creates event provider params', () => {
    const params = miniAppsLaunchParams.eventProviderParams(vkMiniAppTestURL)
    expect(params).toMatchObject({
      mauid: '1094041',
      maaid: '7926703',
      malang: 'ru',
      mac: '',
      maref: 'other',
      map: 'mobile_web'
    })
  })

  it('creates event provider params', () => {
    const params = miniAppsLaunchParams.launchEventParams(vkMiniAppTestURL)
    expect(params).toMatchObject({
      maane: '0',
      maiau: '0',
      maif: '0',
      mats: '1632238478'
    })
  })
})
