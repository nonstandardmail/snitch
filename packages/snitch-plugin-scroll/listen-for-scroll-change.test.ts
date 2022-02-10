import listenForScrollChange, { clearScrollDepthsCache } from './listen-for-scroll-change'

describe('#listenForScrollChange', () => {
  it('has functions to add scroll listeners and clear scroll depth cache', async () => {
    expect(clearScrollDepthsCache).toBeInstanceOf(Function)
    expect(listenForScrollChange).toBeInstanceOf(Function)
  })
})
