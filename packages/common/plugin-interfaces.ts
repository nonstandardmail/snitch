import { TrackerEventPayload } from './tracker-event-payload-type'

export interface EventPayloadParamsProvider {
  getEventPayloadParams(): { [key: string]: string | number }
}

export interface InitializationHandler {
  onInit(): void
}

export interface BeforeCaptureEventHandler {
  beforeCaptureEvent(
    eventName: string,
    eventParams?: TrackerEventPayload,
    eventValue?: string | number
  ): void
}

export type Plugin = Partial<
  EventPayloadParamsProvider & InitializationHandler & BeforeCaptureEventHandler
>
