const ENABLE_GEOIP_CENSORSHIP = true
let shouldCensor = false

if (ENABLE_GEOIP_CENSORSHIP) {
  const geoip = await (await fetch('https://api.ip.sb/geoip')).json()

  // if date falls into a date range
  function isDateInRange(date: Date, start: Date, end: Date) {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
  }

  shouldCensor =
    geoip.country_code === 'CN' &&
    isDateInRange(new Date(), new Date('2022-10-01'), new Date('2022-10-24'))
}

export default shouldCensor
