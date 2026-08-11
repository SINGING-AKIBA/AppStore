import crypto from 'crypto'
import bcrypt from 'bcrypt'
import BigNumber from 'bignumber.js';
import _ from 'lodash'
import { defaults } from 'joi';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * PHP date() 函数的 TypeScript 实现
 * @param format 格式字符串 (支持 PHP date 的全部常用格式字符)
 * @param timestamp 可选时间戳 (毫秒时间戳或 Date 对象，默认当前时间)
 */
export function date(format: string, timestamp?: number | Date): string {
  const d = timestamp instanceof Date ? new Date(timestamp) : timestamp ? new Date(timestamp) : new Date();
  const Y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const n = d.getMonth() + 1;
  const d_ = String(d.getDate()).padStart(2, '0');
  const j = d.getDate();
  const H = String(d.getHours()).padStart(2, '0');
  const G = d.getHours();
  const h = String(d.getHours() % 12 || 12).padStart(2, '0');
  const g = d.getHours() % 12 || 12;
  const i = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const w = d.getDay();
  const N = w === 0 ? 7 : w;
  const A = d.getHours() < 12 ? 'AM' : 'PM';
  const a = A.toLowerCase();
  const L = (Y % 4 === 0 && (Y % 100 !== 0 || Y % 400 === 0)) ? 1 : 0;
  const t = new Date(Y, n, 0).getDate();
  const U = Math.floor(d.getTime() / 1000);
  const l = DAY_NAMES[w];
  const D = DAY_NAMES_SHORT[w];
  const F = MONTH_NAMES[d.getMonth()];
  const M = MONTH_NAMES_SHORT[d.getMonth()];
  const z = Math.floor((d.getTime() - new Date(Y, 0, 0).getTime()) / 86400000);
  const y = String(Y).slice(-2);
  const W = getIsoWeek(d);
  const S = getOrdinalSuffix(j);
  const O = getTimezoneOffset(d);
  const P = O.slice(0, 3) + ':' + O.slice(3);
  const T = d.toLocaleDateString('en-US', { timeZoneName: 'short' as any }).split(' ').pop() || '';
  const Z = -d.getTimezoneOffset() * 60;
  const I = isDST(d) ? 1 : 0;
  const c = `${Y}-${m}-${d_}T${H}:${i}:${s}${P}`;
  const r = `${D}, ${d_} ${M} ${Y} ${H}:${i}:${s} ${O}`;

  const map: Record<string, string> = {
    Y: String(Y), y, m, n: String(n), d: d_, j: String(j),
    H, G: String(G), h, g: String(g), i, s,
    A, a, w: String(w), N: String(N), z: String(z),
    W: String(W).padStart(2, '0'), t: String(t), L: String(L),
    U: String(U), l, D, F, M, S, O, P, T: String(T), Z: String(Z), I: String(I),
    c, r,
  };

  let result = '';
  for (let idx = 0; idx < format.length; idx++) {
    const ch = format[idx];
    if (ch === '\\' && idx + 1 < format.length) {
      result += format[++idx];
    } else if (map[ch] !== undefined) {
      result += map[ch];
    } else {
      result += ch;
    }
  }
  return result;
}

function getIsoWeek(d: Date): number {
  const target = new Date(d.getTime());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.getTime()) / 86400000 / 7);
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function getTimezoneOffset(d: Date): string {
  const offset = -d.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return sign + String(hours).padStart(2, '0') + String(minutes).padStart(2, '0');
}

function isDST(d: Date): boolean {
  const jan = new Date(d.getFullYear(), 0, 1);
  const jul = new Date(d.getFullYear(), 6, 1);
  const std = Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return d.getTimezoneOffset() < std;
}

export function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex')
}
export function sha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

export function password_hash(password: string, cost: number = 10) {
  return bcrypt.hashSync(password, cost)
}

export function password_verify(password: string, hash: string) {
  // 确保PHP生成的$2y$前缀能被正确识别
  if (hash.startsWith('$2y$')) {
    hash = hash.replace('$2y$', '$2b$')
  }
  return bcrypt.compareSync(password, hash)
}


/**
 * 格式化日期
 * @param input 输入日期字符串
 * @returns 格式化后的日期字符串
 */

export function formatDate(input: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  }
  const parts = input.trim().split(/[.\-\/\s]+/).filter(Boolean);
  if (parts.length === 1) {
    return `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  }
  if (parts.length === 2) {
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
      return `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    }
    return `${currentYear}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }
  if (parts.length >= 3) {
    let year, month, day;
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      year = parseInt(parts[2], 10);
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
    }
    if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
      return `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    }
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }
  return `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}

export function parseDateRange(timeRange: string){
  const defaultValue = { start: formatDate(''), end: formatDate('') }
  if (!timeRange || timeRange === '无' || timeRange.length < 6) return defaultValue;
  const parts = timeRange.split(/[-–—]{1,2}\s*/).map(s => s.trim());
  if (parts.length < 2) return defaultValue;
  return {
    start: formatDate(parts[0]),
    end: formatDate(parts[1])
  };
};


/**
 * 从字符串中提取并返回精准的数字（BigNumber）
 * 支持处理千分位逗号、货币符号等杂质
 * @param str 原始字符串，如 "1,234.56" 或 "¥123.45"
 */
export function getNumber(str: string | number): number {
  if (!str) return 0;
  if (typeof str === 'number') return str;
  const cleanedStr = str.replace(/[^0-9.-]/g, '');
  return new BigNumber(cleanedStr || 0).toNumber();
}