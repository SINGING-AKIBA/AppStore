export function date(format: string, timestamp?: number | Date | string): string {
  const d = timestamp ? new Date(timestamp) : new Date()

  if (isNaN(d.getTime())) {
    return ''
  }

  const pad = (n: number, len = 2): string => String(n).padStart(len, '0')

  const formatMap: Record<string, string | (() => string)> = {
    Y: () => String(d.getFullYear()),
    y: () => pad(d.getFullYear() % 100),
    m: () => pad(d.getMonth() + 1),
    n: () => String(d.getMonth() + 1),
    M: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()],
    F: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()],
    d: () => pad(d.getDate()),
    j: () => String(d.getDate()),
    l: () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()],
    D: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
    w: () => String(d.getDay()),
    W: () => {
      const start = new Date(d.getFullYear(), 0, 1)
      const day = start.getDay() || 7
      const diff = d.getTime() - start.getTime()
      const week = Math.ceil(((diff / 86400000) + day) / 7)
      return pad(week)
    },
    H: () => pad(d.getHours()),
    G: () => String(d.getHours()),
    h: () => pad(d.getHours() % 12 || 12),
    g: () => String(d.getHours() % 12 || 12),
    i: () => pad(d.getMinutes()),
    s: () => pad(d.getSeconds()),
    a: () => (d.getHours() >= 12 ? 'pm' : 'am'),
    A: () => (d.getHours() >= 12 ? 'PM' : 'AM'),
    u: () => pad(d.getMilliseconds() * 1000, 6),
    v: () => pad(d.getMilliseconds(), 3),
    Z: () => {
      const offset = d.getTimezoneOffset() * -60
      return String(offset)
    },
    O: () => {
      const sign = d.getTimezoneOffset() > 0 ? '-' : '+'
      const abs = Math.abs(d.getTimezoneOffset())
      return sign + pad(Math.floor(abs / 60) * 100 + (abs % 60), 4)
    },
    T: () => d.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop() || 'UTC',
    c: () => d.toISOString(),
    r: () => d.toUTCString(),
    U: () => String(Math.floor(d.getTime() / 1000)),
  }

  let result = ''
  let i = 0
  while (i < format.length) {
    const char = format[i]
    if (char === '\\') {
      result += format[i + 1] || ''
      i += 2
      continue
    }
    if (formatMap[char]) {
      result += typeof formatMap[char] === 'function' ? formatMap[char]() : formatMap[char]
    } else {
      result += char
    }
    i++
  }

  return result
}

export function time(): number {
  return Math.floor(Date.now() / 1000)
}

export function strtotime(timeStr: string, now?: number): number {
  
  const base = now ? new Date(now * 1000) : new Date()
  if(!timeStr){
    return 0
  }
  const s = timeStr.toLowerCase().trim()
  const match = s.match(/^(\+|-)(\d+)\s+(second|minute|hour|day|week|month|year)s?$/)

  if (match) {
    const sign = match[1] === '+' ? 1 : -1
    const num = parseInt(match[2], 10)
    const unit = match[3]
    const ms = sign * num * {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    }[unit]
    return Math.floor((base.getTime() + ms) / 1000)
  }

  const date = new Date(s)
  if (!isNaN(date.getTime())) {
    return Math.floor(date.getTime() / 1000)
  }

  return 0
}

export function strftime(format: string, timestamp?: number): string {
  return date(format, timestamp)
}