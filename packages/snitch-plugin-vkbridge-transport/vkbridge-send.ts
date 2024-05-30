/** This one implements vk bridge send method so that
 * bridge does not have to be loaded prior to sending events */

const method = 'VKWebAppTrackEvent'
const webFrameId = undefined
const version = '2.14.1'

/** Is the client side runtime environment */
export const IS_CLIENT_SIDE = typeof window !== 'undefined'

/** Is the runtime environment an Android app */
export const IS_ANDROID_WEBVIEW = Boolean(IS_CLIENT_SIDE && (window as any).AndroidBridge)

/** Is the runtime environment an iOS app */
export const IS_IOS_WEBVIEW = Boolean(
  IS_CLIENT_SIDE &&
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.VKWebAppClose
)

export const IS_REACT_NATIVE_WEBVIEW = Boolean(
  IS_CLIENT_SIDE &&
    (window as any).ReactNativeWebView &&
    typeof (window as any).ReactNativeWebView.postMessage === 'function'
)

/** Is the runtime environment a browser */
export const IS_WEB = IS_CLIENT_SIDE && !IS_ANDROID_WEBVIEW && !IS_IOS_WEBVIEW

/** Android VK Bridge interface. */
const androidBridge: Record<string, (serializedData: string) => void> | undefined = IS_CLIENT_SIDE
  ? (window as any).AndroidBridge
  : undefined

/** iOS VK Bridge interface. */
const iosBridge: Record<string, { postMessage?: (data: any) => void }> | undefined = IS_IOS_WEBVIEW
  ? (window as any).webkit.messageHandlers
  : undefined

/** Web VK Bridge interface. */
const webBridge: { postMessage?: (message: any, targetOrigin: string) => void } | undefined = IS_WEB
  ? parent
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

  // Sending data through React Native bridge
  else if (IS_REACT_NATIVE_WEBVIEW) {
    ;(window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        handler: method,
        params: props
      })
    )
  }

  // Sending data through web bridge
  else if (webBridge && typeof webBridge.postMessage === 'function') {
    webBridge.postMessage(
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
