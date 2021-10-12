import { EventPayloadParamsProvider } from '../common/plugin-interfaces'

export default function useragentPlugin(): EventPayloadParamsProvider {
  return {
    getEventPayloadParams() {
      return {
        ua: window.navigator.userAgent
      }
    }
  }
}
