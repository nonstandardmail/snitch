import '../common/testutil/setup-crypto'
import sessionPlugin, { SESSION_EXPIRING_INACTIVITY_TIME_MSEC } from './session'
import * as storage from './storage'

describe('Session plugin', () => {
  let captureEvent = jest.fn()
  const plugin = sessionPlugin()
  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('it starts new session on init when runs first time on device', () => {
    // persists session details
    expect(storage.getSessionId()).toBeTruthy()
    expect(storage.getLastInteractiveEventTS()).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(1)
    expect(storage.getSessionUTMParams()).toEqual('')
    // sends sessionStart event
    expect(captureEvent).toBeCalledWith('sessionStart')
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
    captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    window.history.replaceState({}, '', '/?utm_source=vk&utm_medium=promopost')
    plugin.setEventHandler(captureEvent)
    plugin.onInit()
    // persists new session details with utm param values
    expect(storage.getSessionId() !== oldSessionId).toBeTruthy()
    expect(storage.getSessionCount()).toEqual(2)
    expect(storage.getSessionUTMParams()).toEqual('vk,promopost')
    // sends sessionStart event
    expect(captureEvent).toBeCalledWith('sessionStart')
    window.history.replaceState({}, '', '/')
  })

  it('it starts a new session on init if existing session is stale', () => {
    captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    plugin.setEventHandler(captureEvent)
    plugin.onInit()
    // captures sessionStart event
    expect(captureEvent).toBeCalledWith('sessionStart')
    // persists new session details
    expect(storage.getSessionId()).not.toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(3)
  })

  it('it does not start new session on init if there is no need to', () => {
    captureEvent = jest.fn()
    const oldSessionId = storage.getSessionId()
    plugin.setEventHandler(captureEvent)
    plugin.onInit()
    // does not capture session start event
    expect(captureEvent).not.toHaveBeenCalled()
    // persists session details stay the same
    expect(storage.getSessionId()).toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(3)
  })

  it('it starts a new session before capturing any events if session is stale', () => {
    captureEvent = jest.fn()
    plugin.setEventHandler(captureEvent)
    const oldSessionId = storage.getSessionId()
    // make current session stale
    storage.setLastInterctiveEventTS(Date.now() - SESSION_EXPIRING_INACTIVITY_TIME_MSEC * 2)
    plugin.beforeCaptureEvent('testEvent')
    // persists new session details
    expect(storage.getSessionId()).not.toEqual(oldSessionId)
    expect(storage.getSessionCount()).toEqual(4)
    // captures sessionStart event
    expect(captureEvent).toHaveBeenCalledWith('sessionStart')
  })
})
