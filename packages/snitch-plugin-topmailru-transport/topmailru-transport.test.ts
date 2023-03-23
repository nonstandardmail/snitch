import { getAnonymousUserId } from '../common/anonymous-id-store'
import { postedTopmailruEventsLog, topmailruCounterMock } from './topmailru-counter-mock'
import topmailruTransportPlugin from './topmailru-transport'

const TEST_TMR_COUNTER_ID = 'TEST'

describe('Top Mail.ru Transport plugin', () => {
  it('it posts TMR anonymous event when sendEvent is called', () => {
    window._tmr = topmailruCounterMock
    const plugin = topmailruTransportPlugin(TEST_TMR_COUNTER_ID)
    plugin.sendEvent('test', { hi: 'bye' })
    expect(postedTopmailruEventsLog[0]).toMatchObject({
      id: TEST_TMR_COUNTER_ID,
      type: 'reachGoal',
      goal: 'test',
      params: { hi: 'bye' },
      userid: getAnonymousUserId()
    })
    expect(getAnonymousUserId()).toMatch(/@anonymous/)
  })

  it('it sends user id with event if userIdResolver provided', () => {
    window._tmr = topmailruCounterMock
    const mockUserId = '12345@vk'
    const plugin = topmailruTransportPlugin(TEST_TMR_COUNTER_ID, () => mockUserId)
    plugin.sendEvent('test', { hi: 'bye' })
    expect(postedTopmailruEventsLog[1]).toMatchObject({
      id: TEST_TMR_COUNTER_ID,
      type: 'reachGoal',
      goal: 'test',
      params: { hi: 'bye' },
      userid: mockUserId
    })
  })
})
