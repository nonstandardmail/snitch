import { Plugin } from './plugin-interfaces'

export type TrackerEventPayload = {
  [key: string]: string | number
}

export type TrackerInitializationOptions = {
  tmrCounterId: string
  appVersion?: string
  plugins?: Array<Plugin>
}
