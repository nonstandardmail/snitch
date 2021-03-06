import { TMRCounter } from './_tmr'

type PostedEventsLog = any[]

export const postedTopmailruEventsLog: PostedEventsLog = []

export const topmailruCounterMock: TMRCounter = {
  push(event) {
    postedTopmailruEventsLog.push(event)
  },
  getClientID() {
    return 'MOCK_CLIENT_ID'
  }
}
