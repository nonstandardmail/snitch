export default function createUniqueId(): string {
  let uniqueId = ''
  window.crypto
    .getRandomValues(new Uint32Array(4))
    .forEach(randomValue => (uniqueId += randomValue.toString(32)))
  return uniqueId
}
