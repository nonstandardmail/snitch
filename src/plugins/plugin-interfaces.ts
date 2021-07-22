import { TrackerEventPayload } from '../tracker'

export interface ParamsProvider {
  getEventParams(): { [key: string]: string | number }
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

export type Plugin = Partial<ParamsProvider & InitializationHandler & BeforeCaptureEventHandler>
