import {
  LOCAL_STORAGE_LAST_INTERACTIVE_EVENT_TS_KEY,
  LOCAL_STORAGE_SESSION_COUNT_KEY,
  LOCAL_STORAGE_SESSION_ENGAGEMENT_TIME_MSEC_KEY,
  LOCAL_STORAGE_SESSION_ID_KEY,
  LOCAL_STORAGE_SESSION_UTM_PARAMS_KEY
} from './constants'

export function setSessionId(sessionId: string) {
  localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, sessionId)
}

export function getSessionId(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_SESSION_ID_KEY)
}

export function setSessionEngagementTime(engagementTimeMsec: number) {
  localStorage.setItem(
    LOCAL_STORAGE_SESSION_ENGAGEMENT_TIME_MSEC_KEY,
    Math.floor(engagementTimeMsec).toString()
  )
}

export function getSessionEngagementTime(): number {
  return parseInt(
    localStorage.getItem(LOCAL_STORAGE_SESSION_ENGAGEMENT_TIME_MSEC_KEY) as string,
    10
  )
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
