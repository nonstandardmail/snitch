import delay from 'delay'
import { nth } from 'ramda'
import { INIT_ERROR_NO_TMR_COUNTER, SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from '../src/constants'
import engagementPlugin from '../src/plugins/engagement'
import locationPlugin from '../src/plugins/location'
import screenPlugin from '../src/plugins/screen'
import sessionPlugin from '../src/plugins/session'
import * as storage from '../src/storage'
import Tracker from '../src/tracker'
import './util/setup-crypto'
import { postedTMREventsLog, tmrCounterMock } from './util/tmr-counter-mock'

const TEST_COUNTER_ID = '3221421'
const TEST_APP_VERSION = '1.0.0'

describe('Tracker', () => {
  const plugins = [
    locationPlugin(Tracker),
    engagementPlugin(Tracker, {
      engagementTrackingIntervalMsec: 100
    }),
    sessionPlugin(Tracker),
    screenPlugin({ screenType: 'onboarding', screenId: 'step1' })
  ]
  it('is initializable', () => {
    expect(Tracker.init).toBeDefined()
  })

  it('it throws error when no window._tmr defined', () => {
    const initWithNoTMRCounter = () => Tracker.init({ tmrCounterId: TEST_COUNTER_ID, plugins })
    expect(initWithNoTMRCounter).toThrow(INIT_ERROR_NO_TMR_COUNTER)
  })

  it('it starts a new session on first init', () => {
    window._tmr = tmrCounterMock
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION, plugins })
    // persists session details
    const sessionId = storage.getSessionId()
    const lastInteractiveEventTS = storage.getLastInteractiveEventTS()
    const sessionCount = storage.getSessionCount()
    const sessionUTMParams = storage.getSessionUTMParams()
    expect(sessionId).toBeTruthy()
    expect(lastInteractiveEventTS).toBeTruthy()
    expect(sessionCount).toEqual(1)
    expect(sessionUTMParams).toEqual('')
    // posts TMR event
    const sessionStartEvent = nth(-2, postedTMREventsLog)
    expect(sessionStartEvent.id).toEqual(TEST_COUNTER_ID)
    expect(sessionStartEvent.type).toEqual('reachGoal')
    expect(sessionStartEvent.goal).toEqual('sessionStart')
    expect(sessionStartEvent.value).toEqual(undefined)
    expect(sessionStartEvent.version).toEqual(TEST_APP_VERSION)
    expect(sessionStartEvent.params).toMatchObject({
      tiid: Tracker.trackerInstanceId,
      href: window.location.href,
      sid: sessionId,
      scnt: sessionCount,
      sutm: ''
    })
    expect(sessionStartEvent.params.set >= 0).toBeTruthy()
  })

  it('it still sends an "open" event on init if new session is not created', () => {
    const sessionId = storage.getSessionId()
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION, plugins })
    // does not start a new session
    expect(storage.getSessionId()).toEqual(sessionId)
    expect(storage.getSessionCount()).toEqual(1)
    // 'open' event is sent
    const openEvent = nth(-1, postedTMREventsLog)
    expect(openEvent.goal).toEqual('open')
    expect(openEvent.params.sid).toEqual(sessionId)
  })

  it('it starts a new session on init if utm params are set and sends them with TMR events', () => {
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION, plugins })
    // persists new session details with utm param values
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    // sends utm params with TMR events
    const sessionStartEvent = nth(-2, postedTMREventsLog)
    const openEvent = nth(-1, postedTMREventsLog)
    expect(sessionStartEvent.params.sid !== oldSessionId).toBeTruthy()
    expect(sessionStartEvent.params.sutm).toEqual('vk,promopost')
    // sends utm params with following events
    expect(openEvent.params.sutm).toEqual('vk,promopost')
  })

  it('it starts a new session on init if existing session is stale', () => {
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    Tracker.init({ tmrCounterId: TEST_COUNTER_ID, appVersion: TEST_APP_VERSION, plugins })
    // persists new session details
    const newSessionId = storage.getSessionId()
    expect(newSessionId !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(3)
    expect(storage.getLastInteractiveEventTS() > 0).toBeTruthy()
    // sends sessionStart TMR event
    const sessionStartEvent = nth(-2, postedTMREventsLog)
    expect(sessionStartEvent.params.sid).toEqual(newSessionId)
    expect(sessionStartEvent.params.scnt).toEqual(3)
  })

  it('it tracks custom events', () => {
    const testEventName = 'testEvent'
    Tracker.captureEvent(testEventName)
    const testEvent = nth(-1, postedTMREventsLog)
    expect(testEvent.goal).toEqual(testEventName)
  })

  it('it tracks events with payload and value', () => {
    const testEventName = 'testEvent'
    const testEventPayload = { param1: '1', param2: 2 }
    const testEventValue = 40
    Tracker.captureEvent(testEventName, testEventPayload, testEventValue)
    const testEvent = nth(-1, postedTMREventsLog)
    expect(testEvent.goal).toEqual(testEventName)
    expect(testEvent.params).toMatchObject(testEventPayload)
    expect(testEvent.value).toEqual(testEventValue)
  })

  it('it updates last interactive event TS after tracking the event', () => {
    const lastInteractiveEventTS = Date.now() - 1
    storage.setLastInterctiveEventTS(lastInteractiveEventTS)
    Tracker.captureEvent('testEvent')
    expect(lastInteractiveEventTS !== storage.getLastInteractiveEventTS()).toBeTruthy()
  })

  it('it starts a new session before tracking event if last interactive event was a while ago', () => {
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    const oldSessionId = storage.getSessionId()
    Tracker.captureEvent('testEvent')
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(nth(-2, postedTMREventsLog).goal).toEqual('sessionStart')
    expect(nth(-1, postedTMREventsLog).params.sid !== oldSessionId).toBeTruthy()
  })

  it('it tracks screen views', () => {
    Tracker.init({
      tmrCounterId: TEST_COUNTER_ID,
      appVersion: TEST_APP_VERSION,
      plugins
    })
    const sessionStartEvent = nth(-2, postedTMREventsLog)
    expect(sessionStartEvent.goal).toEqual('sessionStart')
    expect(sessionStartEvent.params.sct).toEqual('onboarding')
    expect(sessionStartEvent.params.scid).toEqual('step1')
    const openEvent = nth(-1, postedTMREventsLog)
    expect(openEvent.goal).toEqual('open')
    expect(openEvent.params.sct).toEqual('onboarding')
    expect(openEvent.params.scid).toEqual('step1')
    Tracker.captureEvent('screenChange', { screenType: 'catalogue' })
    const screenChangeEvent = nth(-1, postedTMREventsLog)
    expect(screenChangeEvent.goal).toEqual('screenChange')
    expect(screenChangeEvent.params.sct).toEqual('catalogue')
    expect(screenChangeEvent.params.scid).toEqual('')
    expect(screenChangeEvent.params.psct).toEqual('onboarding')
    expect(screenChangeEvent.params.pscid).toEqual('step1')
  })

  it('it tracks location changes by sending locationChange event', async () => {
    const oldLocation = window.location.href
    window.history.pushState({}, '', '/login')
    await delay(1)
    const locationChangeEvent = nth(-1, postedTMREventsLog)
    expect(locationChangeEvent.goal).toEqual('locationChange')
    expect(locationChangeEvent.params.href).toEqual(window.location.href)
    expect(locationChangeEvent.params.phref).toEqual(oldLocation)
  })

  it('it does not track location changes if location.href stays the same', async () => {
    const eventsLogLengthBeforePushState = postedTMREventsLog.length
    window.history.pushState({}, '', '/login')
    await delay(1)
    expect(postedTMREventsLog.length).toEqual(eventsLogLengthBeforePushState)
  })

  it('it sends engagement events periodically', async () => {
    Tracker.init({
      tmrCounterId: TEST_COUNTER_ID,
      appVersion: TEST_APP_VERSION,
      plugins
    })
    await delay(250)
    expect(nth(-1, postedTMREventsLog).goal).toEqual('engage')
    expect(nth(-2, postedTMREventsLog).goal).toEqual('engage')
  })
})
