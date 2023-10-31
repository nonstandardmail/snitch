const LOCAL_STORAGE_USER_ID_KEY = 'isdp:auid'
let anonymousUserIdCache: string | null

export function setAnonymousUserId(userId: string) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId)
  } catch (error) {}
  anonymousUserIdCache = userId
}

export function getAnonymousUserId(): string | null {
  if (anonymousUserIdCache) return anonymousUserIdCache
  try {
    anonymousUserIdCache = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY)
  } catch (error) {
    console.warn(error)
    return null
  }
  return anonymousUserIdCache
}
