declare global {
  interface Window {
    _tmr: TMRCounter | UninitializedTMRCounter
  }
}

export type UninitializedTMRCounter = Array<
  | TMRInstructionSendCustomEvent
  | TMRInstructionSetUserId
  | TMRInstructionUnsetUserId
  | TMRInstructionSetOnReadyCallback
>

interface TMRInstruction {
  id: string
  type: string
}

export interface TMRInstructionSendCustomEvent extends TMRInstruction {
  type: 'reachGoal'
  goal: string
  params?: IMRCustomEventParams
  value?: number
  version?: string
  userid?: string
}

export interface IMRCustomEventParams {
  [key: string]: string | number | boolean
}

export interface TMRInstructionSetUserId {
  type: 'setUserID'
  userid: string
}

export interface TMRInstructionUnsetUserId {
  type: 'deleteUserID'
}

export interface TMRInstructionSetOnReadyCallback {
  type: 'onReady'
  callback: Function
}

export interface TMRCounter {
  push(
    instruction:
      | TMRInstructionSendCustomEvent
      | TMRInstructionSetUserId
      | TMRInstructionUnsetUserId
      | TMRInstructionSetOnReadyCallback
  ): void
  getUserID(): string | undefined
}

export const getTMRCounterUserId = () => {
  const _tmr = window._tmr as TMRCounter
  if (_tmr.getUserID) return _tmr.getUserID()
  const userId = (window._tmr as UninitializedTMRCounter).reduce((userId, eventCandidate) => {
    if (eventCandidate.type === 'setUserID') return eventCandidate.userid
    return userId
  }, '')
  return userId || null
}
