const LOCAL_STORAGE_SESSION_ID_KEY = 'isdp:sid'
const LOCAL_STORAGE_SESSION_COUNT_KEY = 'isdp:scnt'
const LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY = 'isdp:sutm'
const LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY = 'isdp:livts'
const LOCAL_STORAGE_SESSION_START_TS_KEY = 'isdp:ssts'

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(error)
  }
}

function safeGet(key: string, defaultValue: string | null): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(error)
    return defaultValue
  }
}

export function setSessionId(sessionId: string) {
  safeSet(LOCAL_STORAGE_SESSION_ID_KEY, sessionId)
}

export function getSessionId(): string | null {
  return safeGet(LOCAL_STORAGE_SESSION_ID_KEY, null)
}

export function setSessionStartTS(engagementTimeMsec: number) {
  safeSet(LOCAL_STORAGE_SESSION_START_TS_KEY, Math.floor(engagementTimeMsec).toString())
}

export function getSessionStartTS(): number {
  return parseInt(safeGet(LOCAL_STORAGE_SESSION_START_TS_KEY, Date.now().toString()) as string, 10)
}

export function setSessionUTMParams(utmParamsCompactString: string) {
  safeSet(LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY, utmParamsCompactString)
}

export function getSessionUTMParams(): string {
  return safeGet(LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY, '') as string
}

export function setLastInterctiveEventTS(lastInteractiveEventTS: number) {
  safeSet(LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY, lastInteractiveEventTS.toString())
}

export function getLastInteractiveEventTS(): number {
  return parseInt(
    safeGet(LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY, Date.now().toString()) as string,
    10
  )
}

export function incrementSessionCount() {
  safeSet(
    LOCAL_STORAGE_SESSION_COUNT_KEY,
    (parseInt(localStorage.getItem(LOCAL_STORAGE_SESSION_COUNT_KEY) || '0', 10) + 1).toString()
  )
}

export function getSessionCount(): number {
  return parseInt(safeGet(LOCAL_STORAGE_SESSION_COUNT_KEY, '1') as string, 10)
}
