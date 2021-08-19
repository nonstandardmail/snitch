import { postedTopmailruEventsLog, topmailruCounterMock } from './topmailru-counter-mock'
import topmailruTransportPlugin from './topmailru-transport'

const TEST_TMR_COUNTER_ID = 'TEST'

describe('Top Mail.ru Transport plugin', () => {
  it('it posts TMR event when sendEvent is called', () => {
    window._tmr = topmailruCounterMock
    const plugin = topmailruTransportPlugin(TEST_TMR_COUNTER_ID)
    plugin.sendEvent('test', { hi: 'bye' })
    expect(postedTopmailruEventsLog[0]).toMatchObject({
      id: TEST_TMR_COUNTER_ID,
      type: 'reachGoal',
      goal: 'test',
      params: { hi: 'bye' }
    })
  })
})
