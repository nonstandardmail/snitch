import { TrackerEventPayload, TrackerInitializationOptions } from './tracker-interfaces'

export interface EventPayloadParamsProvider {
  getEventPayloadParams(): { [key: string]: string | number }
}

export interface InitializationHandler {
  onInit(options: TrackerInitializationOptions): void
}

export interface BeforeCaptureEventHandler {
  beforeCaptureEvent(
    eventName: string,
    eventParams?: TrackerEventPayload,
    eventValue?: string | number
  ): void
}

export interface EventTransport {
  sendEvent(
    eventName: string,
    eventParams?: TrackerEventPayload,
    eventValue?: string | number
  ): void
}

export type Plugin = Partial<
  EventPayloadParamsProvider & InitializationHandler & BeforeCaptureEventHandler & EventTransport
>
