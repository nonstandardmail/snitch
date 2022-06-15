import delay from 'delay'
import '../common/testutil/setup-crypto'
import launchPlugin from './launch'

describe('Launch plugin', () => {
  const captureEvent = jest.fn()
  const plugin = launchPlugin()
  plugin.setEventHandler(captureEvent)
  plugin.onInit()

  it('sends open event on init', async () => {
    await delay(0)
    expect(captureEvent).toHaveBeenCalledWith('launch', {
      ifr: (window.self !== window.top).toString()
    })
  })

  it('it provides lid event param', async () => {
    expect(plugin.getEventPayloadParams().lid).toBeDefined()
    expect(plugin.getEventPayloadParams().ref).toEqual(window.document.referrer)
  })
})
