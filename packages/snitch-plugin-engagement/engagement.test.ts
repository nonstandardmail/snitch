import delay from 'delay'
import engagementPlugin from './engagement'

describe('Engagement plugin', () => {
  it('it sends engagement events periodically', async () => {
    const captureEvent = jest.fn()
    const trackerMock = { captureEvent }
    engagementPlugin(trackerMock, 100)
    await delay(250)
    // sends 'engage' events
    expect(captureEvent).toBeCalledTimes(2)
    expect(captureEvent).toHaveBeenCalledWith('engage')
  })
})
