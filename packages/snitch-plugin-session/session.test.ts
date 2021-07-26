import '../common/testutil/setup-crypto'
import sessionPlugin, { SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from './session'
import * as storage from './storage'

describe('Session plugin', () => {
  const trackerMock = { captureEvent: () => {} }
  const plugin = sessionPlugin(trackerMock)
  const initializationOptions = { tmrCounterId: '', appVersion: '0.0.0' }

  it('it starts new session on init when runs first time on device', () => {
    trackerMock.captureEvent = jest.fn()
    plugin.onInit(initializationOptions)
    // persists session details
    expect(storage.getSessionId()).toBeTruthy()
    expect(storage.getLastInteractiveEventTS()).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(1)
    expect(storage.getSessionUTMParams()).toEqual('')
    // sends sessionStart event
    expect(trackerMock.captureEvent).toBeCalledWith('sessionStart')
  })

  it('it provides persisted session details as event params', async () => {
    expect(plugin.getEventPayloadParams()).toMatchObject({
      sid: storage.getSessionId(),
      scnt: storage.getSessionCount(),
      sutm: storage.getSessionUTMParams()
    })
    expect(plugin.getEventPayloadParams().set).toBeDefined()
  })

  it('it starts a new session on init if utm params are set', () => {
    trackerMock.captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    plugin.onInit(initializationOptions)
    // persists new session details with utm param values
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    // sends sessionStart event
    expect(trackerMock.captureEvent).toBeCalledWith('sessionStart')
    window.history.replaceState({}, '', '/')
  })

  it('it starts a new session on init if existing session is stale', () => {
    trackerMock.captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    plugin.onInit(initializationOptions)
    // captures sessionStart event
    expect(trackerMock.captureEvent).toBeCalledWith('sessionStart')
    // persists new session details
    expect(storage.getSessionId()).not.toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(3)
  })

  it('it does not start new session on init if there is no need to', () => {
    trackerMock.captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    plugin.onInit(initializationOptions)
    // does not capture session start event
    expect(trackerMock.captureEvent).not.toHaveBeenCalled()
    // persists session details stay the same
    expect(storage.getSessionId()).toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(3)
  })

  it('it starts a new session before capturing any events if session is stale', () => {
    trackerMock.captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    plugin.beforeCaptureEvent('testEvent')
    // persists new session details
    expect(storage.getSessionId()).not.toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(4)
    // captures sessionStart event
    expect(trackerMock.captureEvent).toHaveBeenCalledWith('sessionStart')
  })
})
