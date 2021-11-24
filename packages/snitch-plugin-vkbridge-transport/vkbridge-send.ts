const method = 'VKWebAppTrackEvent'
const webFrameId = undefined
const version = '2.5.0'

export const IS_CLIENT_SIDE = typeof window !== 'undefined'
export const IS_ANDROID_WEBVIEW = Boolean(IS_CLIENT_SIDE && (window as any).AndroidBridge)
export const IS_IOS_WEBVIEW = Boolean(
  IS_CLIENT_SIDE &&
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.VKWebAppClose
)
export const IS_WEB = IS_CLIENT_SIDE && !IS_ANDROID_WEBVIEW && !IS_IOS_WEBVIEW
const androidBridge: Record<string, (serializedData: string) => void> | undefined = IS_CLIENT_SIDE
  ? (window as any).AndroidBridge
  : undefined

/** iOS VK Bridge interface. */
const iosBridge: Record<string, { postMessage?: (data: any) => void }> | undefined = IS_IOS_WEBVIEW
  ? (window as any).webkit.messageHandlers
  : undefined

interface VKWebAppTrackEventPayload {
  custom_user_id?: string
  event_name: string
  event_params?: {
    [key: string]: string | number | boolean
  }
}

export default function send(props: VKWebAppTrackEventPayload) {
  // Sending data through Android bridge
  if (androidBridge && androidBridge[method]) {
    androidBridge[method](JSON.stringify(props))
  }

  // Sending data through iOS bridge
  else if (iosBridge && iosBridge[method] && typeof iosBridge[method].postMessage === 'function') {
    iosBridge[method].postMessage!(props)
  }

  // Sending data through web bridge
  else if (IS_WEB) {
    parent.postMessage(
      {
        handler: method,
        params: props,
        type: 'vk-connect',
        webFrameId,
        connectVersion: version
      },
      '*'
    )
  }
}
