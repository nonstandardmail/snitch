import delay from 'delay'
import locationChangeTrackerPlugin from '../src/plugins/location-change-tracker/location-change-tracker-plugin'

describe('Tracker', () => {
  it('it sends engagement events periodically', async () => {
    const captureEvent = jest.fn()
    const trackerMock = { captureEvent }
    window.history.pushState({}, '', '/page1')
    locationChangeTrackerPlugin(trackerMock)
    window.history.pushState({}, '', '/page2')
    await delay(1)
    expect(captureEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page1' })
    window.history.pushState({}, '', '/page3')
    await delay(1)
    expect(captureEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page2' })
  })
})
