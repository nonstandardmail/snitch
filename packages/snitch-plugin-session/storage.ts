const LOCAL_STORAGE_SESSION_ID_KEY = 'isdp:sid'
const LOCAL_STORAGE_SESSION_COUNT_KEY = 'isdp:scnt'
const LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY = 'isdp:sutm'
const LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY = 'isdp:livts'
const LOCAL_STORAGE_SESSION_START_TS_KEY = 'isdp:ssts'

export function setSessionId(sessionId: string) {
  localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, sessionId)
}

export function getSessionId(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_SESSION_ID_KEY)
}

export function setSessionStartTS(engagementTimeMsec: number) {
  localStorage.setItem(
    LOCAL_STORAGE_SESSION_START_TS_KEY,
    Math.floor(engagementTimeMsec).toString()
  )
}

export function getSessionStartTS(): number {
  return parseInt(localStorage.getItem(LOCAL_STORAGE_SESSION_START_TS_KEY) as string, 10)
}

export function setSessionUTMParams(utmParamsCompactString: string) {
  localStorage.setItem(LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY, utmParamsCompactString)
}

export function getSessionUTMParams(): string {
  return localStorage.getItem(LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY) as string
}

export function setLastInterctiveEventTS(lastInteractiveEventTS: number) {
  localStorage.setItem(
    LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY,
    lastInteractiveEventTS.toString()
  )
}

export function getLastInteractiveEventTS(): number {
  return parseInt(localStorage.getItem(LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY) as string, 10)
}

export function incrementSessionCount() {
  localStorage.setItem(
    LOCAL_STORAGE_SESSION_COUNT_KEY,
    (parseInt(localStorage.getItem(LOCAL_STORAGE_SESSION_COUNT_KEY) || '0', 10) + 1).toString()
  )
}

export function getSessionCount(): number {
  return parseInt(localStorage.getItem(LOCAL_STORAGE_SESSION_COUNT_KEY) as string, 10)
}
