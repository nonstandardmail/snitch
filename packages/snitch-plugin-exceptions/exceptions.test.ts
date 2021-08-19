import delay from 'delay'
import exceptionsPlugin from './exceptions'

describe('Exceptions plugin', () => {
  const captureEvent = jest.fn()
  const plugin = exceptionsPlugin()
  plugin.onInit()
  plugin.setEventHandler(captureEvent)

  // make node process to not to exit on errors
  window.addEventListener('error', event => event.preventDefault())

  it('it sends error events', async () => {
    setTimeout(() => {
      throw new Error('test')
    }, 0)
    await delay(1)
    expect(captureEvent).toHaveBeenCalledWith('uncaughtError', {
      error: 'Error: test',
      message: 'test',
      filename: __filename,
      lineno: '15',
      colno: '13'
    })
  })
})
