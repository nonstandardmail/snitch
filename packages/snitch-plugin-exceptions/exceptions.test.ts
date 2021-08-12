import delay from 'delay'
import exceptionsPlugin from './exceptions'

describe('Location plugin', () => {
  const captureEvent = jest.fn()
  const trackerMock = { captureEvent }
  exceptionsPlugin(trackerMock).onInit({})

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
      lineno: '14',
      colno: '13'
    })
  })
})
