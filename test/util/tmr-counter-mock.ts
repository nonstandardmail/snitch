import { TMRCounter } from '../../src/tmr-counter'

type PostedEventsLog = any[]

export const postedTMREventsLog: PostedEventsLog = []

export const tmrCounterMock: TMRCounter = {
  push(event) {
    postedTMREventsLog.push(event)
  },
  getClientID() {
    return 'MOCK_CLIENT_ID'
  }
}
