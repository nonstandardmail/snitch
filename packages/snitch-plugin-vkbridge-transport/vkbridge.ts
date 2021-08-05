declare global {
  interface Window {
    vkBridge: VKBridge | undefined
  }
}

interface VKWebAppTrackEventPayload {
  custom_user_id?: string
  event_name: string
  event_params?: {
    [key: string]: string | number | boolean
  }
}

export interface VKBridge {
  send(eventName: 'VKWebAppTrackEvent', payload: VKWebAppTrackEventPayload): void
}
