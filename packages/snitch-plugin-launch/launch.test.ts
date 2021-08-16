import '../common/testutil/setup-crypto'
import openPlugin from './launch'

describe('Open plugin', () => {
  const trackerMock = { captureEvent: jest.fn() }
  const plugin = openPlugin(trackerMock)

  it('sends open event on init', () => {
    plugin.onInit({ plugins: [] })
    expect(trackerMock.captureEvent).toHaveBeenCalledWith('launch', {
      ifr: (window.self !== window.top).toString(),
      ref: window.document.referrer
    })
  })

  it('it provides lid event param', async () => {
    expect(plugin.getEventPayloadParams().lid).toBeDefined()
  })
})
