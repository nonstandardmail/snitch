const createParamsReader = (paramsMap: { [key: string]: string }) => (href: string) => {
  const url = new URL(href)
  return Object.entries(paramsMap).reduce((params, [searchStringName, shortName]) => {
    params[shortName] = url.searchParams.get(searchStringName) || ''
    return params
  }, {} as { [key: string]: string })
}

const eventProviderParamsMap = {
  vk_user_id: 'mauid',
  vk_app_id: 'maaid',
  vk_language: 'malang',
  vk_client: 'mac',
  vk_platform: 'map',
  vk_ref: 'maref'
}

const launchEventParamsMap = {
  vk_are_notifications_enabled: 'maane',
  vk_is_app_user: 'maiau',
  vk_is_favorite: 'maif',
  vk_ts: 'mats'
}

export default {
  launchEventParams: createParamsReader(launchEventParamsMap),
  eventProviderParams: createParamsReader(eventProviderParamsMap)
}
