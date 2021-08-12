import webVitalsPlugin from './web-vitals'

describe('Location plugin', () => {
  const captureEvent = jest.fn()
  const trackerMock = { captureEvent }
  it('can’t really test web vitals in this environment', async () => {
    webVitalsPlugin(trackerMock).onInit({})
    expect(captureEvent).not.toHaveBeenCalled()
  })
})
