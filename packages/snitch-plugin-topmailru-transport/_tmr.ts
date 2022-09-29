declare global {
  interface Window {
    _tmr:
      | TMRCounter
      | Array<
          | TMRInstructionSendCustomEvent
          | TMRInstructionSetUserId
          | TMRInstructionUnsetUserId
          | TMRInstructionSetOnReadyCallback
        >
  }
}

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
