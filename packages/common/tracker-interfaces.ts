import { Plugin } from './plugin-interfaces'

export type TrackerEventPayload = {
  [key: string]: string | number
}

export type TrackerInitializationOptions = {
  plugins?: Array<Plugin>
}
