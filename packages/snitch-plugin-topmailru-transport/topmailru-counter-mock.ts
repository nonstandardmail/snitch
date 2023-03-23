import { TMRCounter } from '../common/tmr'

type PostedEventsLog = any[]

export const postedTopmailruEventsLog: PostedEventsLog = []

export const topmailruCounterMock: TMRCounter = {
  push(event) {
    postedTopmailruEventsLog.push(event)
  },
  getUserID() {
    return undefined
  }
}
