import { EventHandler, TrackerEventPayload } from './tracker-interfaces'

export interface EventPayloadParamsProvider {
  getEventPayloadParams(): { [key: string]: string | number }
}

export interface InitializationHandler {
  onInit(): void
}

export interface EventSource {
  setEventHandler(eventHandler: EventHandler): void
}

export interface BeforeCaptureEventHandler {
  beforeCaptureEvent(eventName: string, eventParams?: TrackerEventPayload): void
}

export interface EventTransport {
  sendEvent(eventName: string, eventParams?: TrackerEventPayload): void
}

export interface MixinProvider {
  getMixins(): Record<string, Function>
}

export type Plugin = Partial<
  EventPayloadParamsProvider &
    InitializationHandler &
    BeforeCaptureEventHandler &
    EventTransport &
    EventSource &
    MixinProvider
>
