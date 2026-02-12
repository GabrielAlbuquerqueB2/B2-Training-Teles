export function getYearMonthDateFormat(dateString) {

  if(!dateString) return;

  const substr = dateString.substring(0,10)
  return substr
}

export function getDateMonthYearFormat(dateString) {

  if(!dateString) return;

  const substr = dateString.substring(0,10)
  const s = substr.split('-')
  return `${s[2]}/${s[1]}/${s[0]}`
}