import openPlugin from '../src/plugins/open'
import './util/setup-crypto'

describe('Open plugin', () => {
  const trackerMock = { captureEvent: jest.fn() }
  const plugin = openPlugin(trackerMock)

  it('sends open event on init', () => {
    plugin.onInit()
    expect(trackerMock.captureEvent).toHaveBeenCalledWith('open', {
      ifr: (window.self !== window.top).toString(),
      ref: window.document.referrer
    })
  })

  it('it provides oid event param', async () => {
    expect(plugin.getEventPayloadParams().oid).toBeDefined()
  })
})
