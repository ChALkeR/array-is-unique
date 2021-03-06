'use strict'

// A variant of deepEqual which sets an order on deep objects
// Throws an error on unsupported
const deepCompare = (obj, obj2) => {
  if (obj === obj2) return 0
  if (!obj && obj2) return -1
  if (obj && !obj2) return 1

  const [type, type2] = [typeof obj, typeof obj2]
  if (type < type2) return -1
  if (type > type2) return 1

  if ((!obj || !obj2) && type === 'number') {
    if (Object.is(obj, obj2)) return 0
    if (Object.is(obj, NaN)) return -1
    if (Object.is(obj2, NaN)) return 1
  }
  if (type === 'number' || type === 'boolean' || type === 'string') {
    if (obj < obj2 || !obj) return -1
    if (obj > obj2 || !obj2) return 1
    return 0
  }

  // Primitives are already compared above, only objects and arrays remain below

  const [proto, proto2] = [Object.getPrototypeOf(obj), Object.getPrototypeOf(obj2)]
  if (proto !== proto2) {
    if (proto === Object.prototype && proto2 === Array.prototype) return -1
    if (proto === Array.prototype && proto2 === Object.prototype) return 1
    throw new Error('Uncomparable')
  }

  let res = 0
  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) throw new Error('Uncomparable')
    if (obj.length < obj2.length) return -1
    if (obj.length > obj2.length) return 1
    obj.some((x, i) => {
      res = deepCompare(x, obj2[i])
      return res !== 0
    })
    return res
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length < keys2.length) return -1
    if (keys.length > keys2.length) return 1
    keys.sort()
    keys2.sort()
    keys.some((key, i) => {
      if (key < keys2[i]) res = -1
      else if (key > keys2[i]) res = 1
      else res = deepCompare(obj[key], obj2[key])
      return res !== 0
    })
    return res
  }
  throw new Error('Uncomparable')
}

const unique = (array, type = []) => {
  let ok = true
  ;[...array].sort((a, b) => {
    if (!ok) return 0
    const res = deepCompare(a, b)
    if (res === 0) ok = false
    return 0
  })
  return ok
}

module.exports = unique
