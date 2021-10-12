import useragentPlugin from './useragent'

describe('Useragent plugin', () => {
  const plugin = useragentPlugin()
  it('it provides lid event param', async () => {
    expect(plugin.getEventPayloadParams().ua).toBeDefined()
  })
})
