export interface TrigonometricFnArg {
  start: number;
  end: number;
  txtOrder: number;
  topologicalOrder: number;
  isMarked: boolean;
}

export interface DateTimeChip {
  val: number;
  str: string;
  isHumanDate: boolean;
}

export const TIME_UNIT_STR = {
  en: {
    "year": "year",
    "month": "month",
    "day": "day",
    "hour": "hour",
    "minute": "minute",
    "second": "second",
    "ms": "ms"
  },
  tr: {
    "year": "yıl",
    "month": "ay",
    "day": "gün",
    "hour": "saat",
    "minute": "dakika",
    "second": "saniye",
    "ms": "ms"
  }
}

export const TIME_UNITS = {
  'year': 31536000000,
  'month': 2592000000,
  'day': 86400000,
  'hour': 3600000,
  'minute': 60000,
  'second': 1000,
  'ms': 1
};

function parseMS(ms: number) {
  if (typeof ms !== 'number') {
    throw new TypeError('Expected a number');
  }

  let o = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, ms: 0 };
  for (let u in o) {
    o[u] = Math.floor(ms / TIME_UNITS[u]);
    ms = ms - o[u] * TIME_UNITS[u];
  }

  return o;
}

export function getPrettyTime(ms: number, lang = 'en') {
  let o = parseMS(ms);
  let s = '';

  for (let u in o) {
    if (o[u] > 0) {
      s += o[u] + ' ' + TIME_UNIT_STR[lang][u] + ' ';
    }
  }
  s = s.substring(0, s.length - 1)
  return s;
}