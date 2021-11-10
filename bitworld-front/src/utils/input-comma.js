export function inputComma(val) {
  if (val.search(/\.\./g) === -1) {
    val = val.replace(/[^0-9.]/g, '')
  } else {
    val = val.replace(/[^0-9]/g, '')
  }
  const parts = val.toString().split('.')
  let result = ''
  if (parts[1]) {
    result =
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (parts[1] ? '.' + parts[1] : '')
  } else {
    result = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return result
}

export function removeComma(val) {
  return val.replace(/,/g, '')
}
