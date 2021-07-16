import delay from 'delay'
import listenForLocationChange from '../src/listen-for-location-change'

describe('#listenForLocationChange', () => {
  it('invokes callback for location changes', async () => {
    const callback = jest.fn()
    listenForLocationChange(callback)
    window.history.pushState({}, '', '/index.html')
    await delay(1)
    window.history.replaceState({}, '', '/index.html?q=searchterm')
    await delay(1)
    window.history.back()
    await delay(1)
    window.history.replaceState({}, '', '/index.html#anchor')
    await delay(1)
    expect(callback).toHaveBeenCalledTimes(4)
  })
})
