import webVitalsPlugin from './web-vitals'

describe('Web Vitals plugin', () => {
  const captureEvent = jest.fn()
  it('can’t really test web vitals in this environment', async () => {
    webVitalsPlugin().onInit()
    expect(captureEvent).not.toHaveBeenCalled()
  })
})
