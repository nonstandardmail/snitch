import delay from 'delay'
import locationPlugin from '../src/plugins/location'

describe('Location plugin', () => {
  const captureEvent = jest.fn()
  const trackerMock = { captureEvent }
  window.history.pushState({}, '', '/page1')
  const plugin = locationPlugin(trackerMock, true)
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
    expect(plugin.getEventParams()).toEqual({ href: window.location.href })
  })
})
