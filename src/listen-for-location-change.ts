const patchMethodWithCallbackCall = (methodName: Function, context: any, callback: Function) => (
  ...args: any
) => {
  const result = methodName.apply(context, [...args])
  setTimeout(() => callback(), 0)
  return result
}

const listeners: Function[] = []

const onStateChange = () => listeners.forEach(listener => listener())

window.history.pushState = patchMethodWithCallbackCall(
  window.history.pushState,
  window.history,
  onStateChange
)
window.history.replaceState = patchMethodWithCallbackCall(
  window.history.replaceState,
  window.history,
  onStateChange
)
window.addEventListener('popstate', onStateChange)

export default function listenForLocationChange(onLocationChange: Function) {
  if (!~listeners.indexOf(onLocationChange)) listeners.push(onLocationChange)
}
