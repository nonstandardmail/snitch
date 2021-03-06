import delay from 'delay'
import { nth } from 'ramda'
import createSnitch from '.'
import '../common/testutil/setup-crypto'
import engagementPlugin from '../snitch-plugin-engagement'
import launchPlugin from '../snitch-plugin-launch'
import locationPlugin from '../snitch-plugin-location'
import screenPlugin from '../snitch-plugin-screens'
import sessionPlugin from '../snitch-plugin-session'
import { SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from '../snitch-plugin-session/session'
import * as storage from '../snitch-plugin-session/storage'
import {
  postedTopmailruEventsLog,
  topmailruCounterMock
} from '../snitch-plugin-topmailru-transport/topmailru-counter-mock'
import topmailruTransportPlugin from '../snitch-plugin-topmailru-transport/topmailru-transport'
const TEST_COUNTER_ID = '3221421'

window._tmr = topmailruCounterMock

const createPlugins = () => [
  locationPlugin({ captureLocationChange: true }),
  engagementPlugin({ engagementTrackingIntervalMsec: 100 }),
  sessionPlugin(),
  screenPlugin({ screenType: 'onboarding', screenId: 'step1' }),
  launchPlugin(),
  topmailruTransportPlugin(TEST_COUNTER_ID)
]

describe('Tracker', () => {
  let snitch

  it('it starts a new session on first init', async () => {
    snitch = createSnitch(...createPlugins())
    await delay(0)
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
    const sessionStartEvent = nth(-2, postedTopmailruEventsLog)
    expect(sessionStartEvent.id).toEqual(TEST_COUNTER_ID)
    expect(sessionStartEvent.type).toEqual('reachGoal')
    expect(sessionStartEvent.goal).toEqual('sessionStart')
    expect(sessionStartEvent.value).toEqual(undefined)
    expect(sessionStartEvent.params).toMatchObject({
      href: window.location.href,
      sid: sessionId,
      scnt: sessionCount,
      sutm: ''
    })
    expect(sessionStartEvent.params.set >= 0).toBeTruthy()
  })

  it('it still sends an "launch" event on init if new session is not created', async () => {
    const sessionId = storage.getSessionId()
    snitch = createSnitch(...createPlugins())
    await delay(0)
    // does not start a new session
    expect(storage.getSessionId()).toEqual(sessionId)
    expect(storage.getSessionCount()).toEqual(1)
    // 'launch' event is sent
    const openEvent = nth(-1, postedTopmailruEventsLog)
    expect(openEvent.goal).toEqual('launch')
    expect(openEvent.params.sid).toEqual(sessionId)
  })

  it('it starts a new session on init if utm params are set and sends them with TMR events', async () => {
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    snitch = createSnitch(...createPlugins())
    await delay(0)
    // persists new session details with utm param values
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    // sends utm params with TMR events
    const sessionStartEvent = nth(-2, postedTopmailruEventsLog)
    const openEvent = nth(-1, postedTopmailruEventsLog)
    expect(sessionStartEvent.params.sid !== oldSessionId).toBeTruthy()
    expect(sessionStartEvent.params.sutm).toEqual('vk,promopost')
    // sends utm params with following events
    expect(openEvent.params.sutm).toEqual('vk,promopost')
  })

  it('it starts a new session on init if existing session is stale', async () => {
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    snitch = createSnitch(...createPlugins())
    await delay(0)
    // persists new session details
    const newSessionId = storage.getSessionId()
    expect(newSessionId !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(3)
    expect(storage.getLastInteractiveEventTS() > 0).toBeTruthy()
    // sends sessionStart TMR event
    const sessionStartEvent = nth(-2, postedTopmailruEventsLog)
    expect(sessionStartEvent.params.sid).toEqual(newSessionId)
    expect(sessionStartEvent.params.scnt).toEqual(3)
  })

  it('it tracks custom events', () => {
    const testEventName = 'testEvent'
    snitch(testEventName)
    const testEvent = nth(-1, postedTopmailruEventsLog)
    expect(testEvent.goal).toEqual(testEventName)
  })

  it('it tracks events with payload', () => {
    const testEventName = 'testEvent'
    const testEventPayload = { param1: '1', param2: 2 }
    snitch(testEventName, testEventPayload)
    const testEvent = nth(-1, postedTopmailruEventsLog)
    expect(testEvent.goal).toEqual(testEventName)
    expect(testEvent.params).toMatchObject(testEventPayload)
  })

  it('it updates last interactive event TS after tracking the event', () => {
    const lastInteractiveEventTS = Date.now() - 1
    storage.setLastInterctiveEventTS(lastInteractiveEventTS)
    snitch('testEvent')
    expect(lastInteractiveEventTS !== storage.getLastInteractiveEventTS()).toBeTruthy()
  })

  it('it starts a new session before tracking event if last interactive event was a while ago', () => {
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    const oldSessionId = storage.getSessionId()
    snitch('testEvent')
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(nth(-2, postedTopmailruEventsLog).goal).toEqual('sessionStart')
    expect(nth(-1, postedTopmailruEventsLog).params.sid !== oldSessionId).toBeTruthy()
  })

  it('it tracks screen views', async () => {
    snitch = createSnitch(...createPlugins())
    await delay(0)
    const sessionStartEvent = nth(-2, postedTopmailruEventsLog)
    expect(sessionStartEvent.goal).toEqual('sessionStart')
    expect(sessionStartEvent.params.sct).toEqual('onboarding')
    expect(sessionStartEvent.params.scid).toEqual('step1')
    const openEvent = nth(-1, postedTopmailruEventsLog)
    expect(openEvent.goal).toEqual('launch')
    expect(openEvent.params.sct).toEqual('onboarding')
    expect(openEvent.params.scid).toEqual('step1')
    snitch('screenChange', { screenType: 'catalogue' })
    const screenChangeEvent = nth(-1, postedTopmailruEventsLog)
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
    const locationChangeEvent = nth(-1, postedTopmailruEventsLog)
    expect(locationChangeEvent.goal).toEqual('locationChange')
    expect(locationChangeEvent.params.href).toEqual(window.location.href)
    expect(locationChangeEvent.params.phref).toEqual(oldLocation)
  })

  it('it does not track location changes if location.href stays the same', async () => {
    const eventsLogLengthBeforePushState = postedTopmailruEventsLog.length
    window.history.pushState({}, '', '/login')
    await delay(1)
    expect(postedTopmailruEventsLog.length).toEqual(eventsLogLengthBeforePushState)
  })

  it('it sends engagement events periodically', async () => {
    snitch = createSnitch(...createPlugins())
    await delay(250)
    expect(nth(-1, postedTopmailruEventsLog).goal).toEqual('engage')
    expect(nth(-2, postedTopmailruEventsLog).goal).toEqual('engage')
  })
})
