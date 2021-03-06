import { randomFillSync } from 'crypto'

function getRandomValuesMock<
  T extends
    | Int8Array
    | Int16Array
    | Int32Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array
    | DataView
>(array: T) {
  return randomFillSync(array)
}

;(window as any).crypto = { getRandomValues: getRandomValuesMock }
