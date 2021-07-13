export default function createSessionId(): string {
  let sessionId = ''
  window.crypto
    .getRandomValues(new Uint32Array(4))
    .forEach(randomValue => (sessionId += randomValue.toString(32)))
  return sessionId
}
