import screenPlugin from '../src/plugins/screen'

describe('Screen plugin', () => {
  const plugin = screenPlugin({ screenType: 'onboarding' })

  it('it provides sct and scid event params', async () => {
    expect(plugin.getEventPayloadParams()).toEqual({ sct: 'onboarding', scid: '' })
  })

  it('it changes event payload to previous screen info and returns new screen info on getEventPayloadParams call', async () => {
    const newScreen = { screenType: 'product', screenId: 'Google Pixel 6' }
    const eventPayload = { ...newScreen }
    plugin.beforeCaptureEvent('screenChange', eventPayload)
    expect(eventPayload).toEqual({ psct: 'onboarding', pscid: '' })
    expect(plugin.getEventPayloadParams()).toEqual({
      sct: newScreen.screenType,
      scid: newScreen.screenId
    })
  })
})
