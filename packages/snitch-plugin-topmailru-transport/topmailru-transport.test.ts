import { postedTopmailruEventsLog, topmailruCounterMock } from './topmailru-counter-mock'
import topmailruTransportPlugin, { ERROR_NO_TMR_COUNTER } from './topmailru-transport'

const TEST_TMR_COUNTER_ID = 'TEST'

describe('Top Mail.ru Transport plugin', () => {
  it('it throws error when no window._tmr defined', () => {
    const plugin = topmailruTransportPlugin(TEST_TMR_COUNTER_ID)
    expect(plugin.onInit).toThrow(ERROR_NO_TMR_COUNTER)
  })

  it('it posts TMR event when sendEvent is called', () => {
    window._tmr = topmailruCounterMock
    const plugin = topmailruTransportPlugin(TEST_TMR_COUNTER_ID)
    plugin.sendEvent('test', { hi: 'bye' }, 0)
    expect(postedTopmailruEventsLog[0]).toMatchObject({
      id: TEST_TMR_COUNTER_ID,
      type: 'reachGoal',
      goal: 'test',
      params: { hi: 'bye' },
      value: 0
    })
  })
})
