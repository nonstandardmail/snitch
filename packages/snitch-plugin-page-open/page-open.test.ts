import '../common/testutil/setup-crypto'
import openPlugin from './page-open'

describe('Open plugin', () => {
  const trackerMock = { captureEvent: jest.fn() }
  const plugin = openPlugin(trackerMock)

  it('sends open event on init', () => {
    plugin.onInit({ tmrCounterId: '', appVersion: '0.0.0' })
    expect(trackerMock.captureEvent).toHaveBeenCalledWith('open', {
      ifr: (window.self !== window.top).toString(),
      ref: window.document.referrer
    })
  })

  it('it provides oid event param', async () => {
    expect(plugin.getEventPayloadParams().oid).toBeDefined()
  })
})
