import { Plugin } from './plugin-interfaces'

export type TrackerEventPayload = {
  [key: string]: string | number
}

export type EventHandler = (eventName: string, eventPayload?: TrackerEventPayload) => void

export type TrackerInitializationOptions = {
  plugins?: Array<Plugin>
}
