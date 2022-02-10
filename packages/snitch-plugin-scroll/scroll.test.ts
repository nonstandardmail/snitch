import scrollPlugin from './scroll'

describe('Scroll plugin', () => {
  const captureEvent = jest.fn()
  it('can’t really test scroll in this environment', async () => {
    scrollPlugin().onInit()
    expect(captureEvent).not.toHaveBeenCalled()
  })
})
