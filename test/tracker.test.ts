import delay from 'delay'
import { nth } from 'ramda'
import {
  ERROR_SCREEN_TRACKING_DISABLED,
  INIT_ERROR_NO_TMR_COUNTER,
  SESSION_EXPIRING_INACTIVITY_TIME_MSEC
} from '../src/constants'
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
    const sessionStartTS = storage.getSessionStartTS()
    const sessionEngagementTimeMsec = Date.now() - sessionStartTS
    const sessionCount = storage.getSessionCount()
    const sessionUTMParams = storage.getSessionUTMParams()
    expect(sessionId).toBeTruthy()
    expect(lastInteractiveEventTS).toBeTruthy()
    expect(sessionCount).toEqual(1)
    expect(sessionUTMParams).toEqual('')
    expect(nth(-2, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        tiid: Tracker.trackerInstanceId,
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

  it('it still sends an "open" event on init if new session is not created', () => {
    const sessionId = storage.getSessionId()
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION })
    expect(storage.getSessionId()).toEqual(sessionId)
    expect(storage.getSessionCount()).toEqual(1)
    const openEvent = nth(-1, postedTMREventsLog)
    expect(openEvent.goal).toEqual('open')
    expect(openEvent.params.sid).toEqual(sessionId)
  })

  it('it starts a new session on init if utm params are set', () => {
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION })
    const sessionStartTS = storage.getSessionStartTS()
    const sessionEngagementTimeMsec = Date.now() - sessionStartTS
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    expect(nth(-2, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        tiid: Tracker.trackerInstanceId,
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 2,
        set: sessionEngagementTimeMsec,
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
    expect(nth(-2, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: 'sessionStart',
      params: {
        tiid: Tracker.trackerInstanceId,
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: 0,
        sutm: 'vk,promopost'
      },
      value: undefined,
      version: TEST_APP_VERSION
    })
  })

  it('it tracks events', () => {
    const testEventName = 'testEvent'
    Tracker.trackEvent(testEventName)
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: testEventName,
      params: {
        tiid: Tracker.trackerInstanceId,
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: Date.now() - storage.getSessionStartTS(),
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
    Tracker.trackEvent(testEventName, testEventPayload, eventValue)
    expect(nth(-1, postedTMREventsLog)).toEqual({
      id: TEST_COUNTER_ID,
      type: 'reachGoal',
      goal: testEventName,
      params: {
        tiid: Tracker.trackerInstanceId,
        href: window.location.href,
        sid: storage.getSessionId(),
        scnt: 3,
        set: Date.now() - storage.getSessionStartTS(),
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
    Tracker.trackEvent('testEvent')
    expect(lastInteractiveEventTS !== storage.getLastInteractiveEventTS()).toBeTruthy()
  })

  it('it starts a new session before tracking event if last interactive event was a while ago', () => {
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    const oldSessionId = storage.getSessionId()
    Tracker.trackEvent('testEvent')
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(nth(-2, postedTMREventsLog).goal).toEqual('sessionStart')
    expect(nth(-1, postedTMREventsLog).params.sid !== oldSessionId).toBeTruthy()
  })

  it('it tracks screen views', () => {
    Tracker.init({
      tmrCounterId: TEST_COUNTER_ID,
      appVersion: TEST_APP_VERSION,
      currentScreen: { screenType: 'onboarding', screenId: 'step1' }
    })
    const sessionStartEvent = nth(-2, postedTMREventsLog)
    expect(sessionStartEvent.goal).toEqual('sessionStart')
    expect(sessionStartEvent.params.sct).toEqual('onboarding')
    expect(sessionStartEvent.params.scid).toEqual('step1')
    const openEvent = nth(-1, postedTMREventsLog)
    expect(openEvent.goal).toEqual('open')
    expect(openEvent.params.sct).toEqual('onboarding')
    expect(openEvent.params.scid).toEqual('step1')
    Tracker.setCurrentScreen('catalogue')
    const screenChangeEvent = nth(-1, postedTMREventsLog)
    expect(screenChangeEvent.goal).toEqual('screenChange')
    expect(screenChangeEvent.params.sct).toEqual('catalogue')
    expect(screenChangeEvent.params.scid).toEqual('')
    expect(screenChangeEvent.params.psct).toEqual('onboarding')
    expect(screenChangeEvent.params.pscid).toEqual('step1')
  })

  it('it throws error on setCurrentScreen call if was initialized with no currentScreen option', () => {
    Tracker.init({
      tmrCounterId: TEST_COUNTER_ID,
      appVersion: TEST_APP_VERSION
    })
    expect(() => Tracker.setCurrentScreen('catalogue')).toThrowError(ERROR_SCREEN_TRACKING_DISABLED)
  })

  it('it tracks location changes by sending locationChange event', async () => {
    const oldLocation = window.location.href
    window.history.pushState({}, '', '/login')
    await delay(1)
    expect(nth(-1, postedTMREventsLog).goal).toEqual('locationChange')
    expect(nth(-1, postedTMREventsLog).params.href).toEqual(window.location.href)
    expect(nth(-1, postedTMREventsLog).params.phref).toEqual(oldLocation)
  })

  it('it does not track location changes if location.href stays the same', async () => {
    const eventsLogLengthBeforePushState = postedTMREventsLog.length
    window.history.pushState({}, '', '/login')
    await delay(1)
    expect(postedTMREventsLog.length).toEqual(eventsLogLengthBeforePushState)
  })
})
