import delay from 'delay'
import locationPlugin from './location'

describe('Location plugin', () => {
  const captureEvent = jest.fn()
  window.history.pushState({}, '', '/page1')
  const plugin = locationPlugin(true)
  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('it sends locationChange events', async () => {
    window.history.pushState({}, '', '/page2')
    await delay(1)
    expect(captureEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page1' })
    window.history.pushState({}, '', '/page3')
    await delay(1)
    expect(captureEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page2' })
  })

  it('it provides href event param', async () => {
    expect(plugin.getEventPayloadParams()).toEqual({ href: window.location.href })
  })
})
