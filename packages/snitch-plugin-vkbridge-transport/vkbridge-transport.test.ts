import { VKBridge } from './vkbridge'
import vkbridgeTransportPlugin from './vkbridge-transport'

describe('VKBridge Transport plugin', () => {
  it('it posts bridge event when sendEvent is called', () => {
    const vkBridge: VKBridge = {
      send: jest.fn()
    }
    const plugin = vkbridgeTransportPlugin(vkBridge)
    plugin.sendEvent('test', { hi: 'bye' })
    expect(vkBridge.send).toHaveBeenCalledWith('VKWebAppTrackEvent', {
      event_name: 'test',
      event_params: { hi: 'bye' }
    })
  })
})
