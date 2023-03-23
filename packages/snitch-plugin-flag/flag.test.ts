import flagPlugin from './flag'

const evaluationResponseMock = {
  requestId: 'e93b3138-dc7a-452d-8541-59d9fcfce701',
  entityId: '49fd748f-5086-42f6-b2811ae03d355d',
  requestContext: {
    foo: 'bar'
  },
  match: true,
  flagKey: 'test',
  segmentKey: 'all-users',
  timestamp: '2023-03-22T14:00:35.696036529Z',
  value: 'c',
  requestDurationMillis: 5.686222,
  attachment: '{"ok":"fine"}'
}

const flagMock = {
  match: true,
  flagKey: 'test',
  variant: 'c',
  attachment: '{"ok":"fine"}'
}

describe('Location plugin', () => {
  const captureEvent = jest.fn()
  const plugin = flagPlugin({
    flagApiEndpoint: 'https://endpoint/api/v1/',
    userIdResolver: () => 'userid'
  })
  plugin.setEventHandler(captureEvent)
  const pluginMixins = plugin.getMixins()

  it('it provides flag getters through getMixins method', async () => {
    expect(pluginMixins.getFlag).toBeDefined()
    expect(pluginMixins.getFlags).toBeDefined()
  })

  it('it gets the flag and sends evaluation event', async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(evaluationResponseMock)
      })
    ) as jest.Mock
    expect(await pluginMixins.getFlag('test')).toEqual(flagMock)
    expect(captureEvent).toBeCalled()
  })
})
