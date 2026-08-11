/**
 * 格式化数字为友好显示的字符串 (如: 1000 -> 1k, 1500000 -> 1.5M)
 * @param num 需要格式化的数字
 * @param decimals 保留的小数位数，默认为 1
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number, decimals: number = 1): string => {
  if (num === 0) return '0';

  // 定义单位映射表，方便后续扩展（如添加 T 代表万亿）
  const units = [
    { value: 1e12, symbol: 'T' }, // 万亿
    { value: 1e9, symbol: 'B' },  // 十亿
    { value: 1e6, symbol: 'M' },  // 百万
    { value: 1e3, symbol: 'k' },  // 千
  ];

  // 处理负数
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // 找到匹配的单位
  const matchedUnit = units.find((unit) => absNum >= unit.value);

  // 如果没有匹配到单位（即数字小于 1000），直接返回原数字
  if (!matchedUnit) {
    return isNegative ? `-${absNum}` : `${absNum}`;
  }

  // 计算除以单位后的数值，并保留指定小数位
  const formattedValue = (absNum / matchedUnit.value).toFixed(decimals);

  // 去除末尾多余的 0 和小数点（例如：1.0k -> 1k）
  const cleanValue = parseFloat(formattedValue).toString();

  return isNegative ? `-${cleanValue}${matchedUnit.symbol}` : `${cleanValue}${matchedUnit.symbol}`;
};



export const getExcerpt = (html:string, length = 50) => {
  if (!html) return ''
  let text = html.replace(/<[^>]+>/g, '')
  return text.length > length ? text.substring(0, length) + '...' : text
}