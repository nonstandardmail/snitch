import vkbridgeTransportPlugin from './vkbridge-transport'

describe('VKBridge Transport Plugin', () => {
  it('it has sendEvent method', () => {
    const plugin = vkbridgeTransportPlugin()
    expect(typeof plugin.sendEvent === 'function').toBeTruthy()
  })
})
