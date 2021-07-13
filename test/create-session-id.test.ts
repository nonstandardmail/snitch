import createSessionId from '../src/create-session-id'
import './util/setup-crypto'

describe('#createSessionId', () => {
  it('it creates unique session id', () => {
    expect(typeof createSessionId() === 'string').toBeTruthy()
    expect(createSessionId() !== createSessionId()).toBeTruthy()
  })
})
