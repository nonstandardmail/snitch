import { nth } from 'ramda'
import { INIT_ERROR_NO_TMR_COUNTER, SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from '../src/constants'
import * as storage from '../src/storage'
import Tracker from '../src/tracker'
import './util/setup-crypto'
import { postedTMREventsLog, tmrCounterMock } from './util/tmr-counter-mock'

const TEST_COUNTER_ID = '3221421'
const TEST_APP_VERSION = '1.0.0'

describe('Tracker', () => {
  it('is initializable', () => {
    expect(Tracker.init).toBeDefined()
  })

  it('it throws error when no window._tmr defined', () => {
    const initWithNoTMRCounter = () => Tracker.init({ tmrCounterId: TEST_COUNTER_ID })
    expect(initWithNoTMRCounter).toThrow(INIT_ERROR_NO_TMR_COUNTER)
  })

  it('it starts a new session on first init', () => {
    window._tmr = tmrCounterMock
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION })
    const sessionId = storage.getSessionId()
    const lastInteractiveEventTS = storage.getLastInteractiveEventTS()
    const sessionEngagementTimeMsec = storage.getSessionEngagementTime()
    const sessionCount = storage.getSessionCount()
    const sessionUTMParams = storage.getSessionUTMParams()
    expect(sessionId).toBeTruthy()
    expect(lastInteractiveEventTS).toBeTruthy()
    expect(sessionEngagementTimeMsec > 0).toBeTruthy()
    expect(sessionCount).toEqual(1)
    expect(sessionUTMParams).toEqual('')
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        href: window.location.href,
        sid: sessionId,
        scnt: sessionCount,
        set: sessionEngagementTimeMsec,
        sutm: ''
      },
      value: undefined,
      version: TEST_APP_VERSION
    })
  })

  it('it starts a new session on init if utm params are set', () => {
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION })
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 2,
        set: storage.getSessionEngagementTime(),
        sutm: 'vk,promopost'
      },
      value: undefined,
      version: TEST_APP_VERSION
    })
  })

  it('it starts a new session on init if existing session is stale', () => {
    const oldSessionId = storage.getSessionId()
    storage.setLastInterctiveEventTS(0)
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION })
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(3)
    expect(storage.getLastInteractiveEventTS() > 0).toBeTruthy()
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: storage.getSessionEngagementTime(),
        sutm: 'vk,promopost'
      },
      value: undefined,
      version: TEST_APP_VERSION
    })
  })

  it('it tracks events', () => {
    const testEventName = 'testEvent'
    Tracker.track(testEventName)
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: testEventName,
      params: {
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: storage.getSessionEngagementTime(),
        sutm: 'vk,promopost'
      },
      value: undefined,
      version: TEST_APP_VERSION
    })
  })

  it('it tracks events with payload and value', () => {
    const testEventName = 'testEvent'
    const testEventPayload = { param1: '1', param2: 2 }
    const eventValue = 40
    Tracker.track(testEventName, testEventPayload, eventValue)
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: testEventName,
      params: {
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: storage.getSessionEngagementTime(),
        sutm: 'vk,promopost',
        ...testEventPayload
      },
      value: eventValue,
      version: TEST_APP_VERSION
    })
  })

  it('it updates last interactive event TS after tracking the event', () => {
    const lastInteractiveEventTS = Date.now() - 1
    storage.setLastInterctiveEventTS(lastInteractiveEventTS)
    Tracker.track('testEvent')
    expect(lastInteractiveEventTS !== storage.getLastInteractiveEventTS()).toBeTruthy()
  })

  it('it starts a new session before tracking event if last interactive event was a while ago', () => {
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    const oldSessionId = storage.getSessionId()
    Tracker.track('testEvent')
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(nth(-2, postedTMREventsLog).goal).toEqual('sessionStart')
    expect(nth(-1, postedTMREventsLog).params.sid !== oldSessionId).toBeTruthy()
  })
})
