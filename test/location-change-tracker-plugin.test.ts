import delay from 'delay'
import locationChangeTrackerPlugin from '../src/plugins/location-change-tracker/location-change-tracker-plugin'

describe('Tracker', () => {
  it('it sends engagement events periodically', async () => {
    const trackEvent = jest.fn()
    const trackerMock = { trackEvent }
    window.history.pushState({}, '', '/page1')
    locationChangeTrackerPlugin(trackerMock)
    window.history.pushState({}, '', '/page2')
    await delay(1)
    expect(trackEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page1' })
    window.history.pushState({}, '', '/page3')
    await delay(1)
    expect(trackEvent).toHaveBeenCalledWith('locationChange', { phref: 'http://localhost/page2' })
  })
})
