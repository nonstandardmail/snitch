import debugLoggerPlugin from './debug-logger'

describe('debugLogger plugin', () => {
  const plugin = debugLoggerPlugin()

  it('it logs tracker initialization options', async () => {
    console.log = jest.fn()
    plugin.onInit()
    expect(console.log).toBeCalledTimes(1)
  })

  it('it logs capture event call', async () => {
    console.log = jest.fn()
    plugin.beforeCaptureEvent('testEvent')
    expect(console.log).toBeCalledTimes(1)
  })

  it('it logs capture event call with params', async () => {
    console.log = jest.fn()
    plugin.beforeCaptureEvent('testEvent', { hello: 'bye' })
    expect(console.log).toBeCalledTimes(2)
  })
})
