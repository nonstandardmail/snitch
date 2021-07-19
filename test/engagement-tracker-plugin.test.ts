import delay from 'delay'
import engagementTrackerPlugin from '../src/plugins/engagement-tracker/engagement-tracker-plugin'

describe('Tracker', () => {
  it('it sends engagement events periodically', async () => {
    const trackEvent = jest.fn()
    const trackerMock = { trackEvent }
    engagementTrackerPlugin(trackerMock, { engagementTrackingInterval: 100 })
    await delay(250)
    expect(trackEvent).toBeCalledTimes(2)
  })
})
