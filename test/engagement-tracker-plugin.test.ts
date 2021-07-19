import delay from 'delay'
import engagementTrackerPlugin from '../src/plugins/engagement-tracker/engagement-tracker-plugin'

describe('Tracker', () => {
  it('it sends engagement events periodically', async () => {
    const captureEvent = jest.fn()
    const trackerMock = { captureEvent }
    engagementTrackerPlugin(trackerMock, { engagementTrackingInterval: 100 })
    await delay(250)
    expect(captureEvent).toBeCalledTimes(2)
  })
})
