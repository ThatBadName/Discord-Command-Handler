function generateId(length, prefix) {
  let possible = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
  possible = possible.split('')
  if (!prefix) prefix = ''
  let final = `${prefix.length > 1 ? `${prefix}-` : ''}`
  for (let i = 0; i < length; ++i) {
    final += possible[Math.floor(Math.random() * possible.length)]
  }
  return final
}

module.exports = generateId