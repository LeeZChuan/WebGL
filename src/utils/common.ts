// 判断数字是否是有效数字
export const judgeCurrentValue = (value: string | number) => {
  if (value === null || value === '' || value === undefined) {
    return false
  }
  return true
}

/** 汉字金额 转换成 数字 */
export function parseFormattedNumber(str: any) {
  if (str === '' || str === null || str === undefined) {
    return NaN // 返回0
  }
  const res = str.toString()
  const numberMap = {
    一: 1,
    十: 10,
    百: 100,
    千: 1000,
    万: 10000,
    十万: 100000,
    百万: 1000000,
    千万: 10000000,
    亿: 100000000,
    十亿: 1000000000,
    百亿: 10000000000,
    千亿: 100000000000,
    兆: 1000000000000,
  }
  const regex = /(一|十|百|千|万|十万|百万|千万|亿|十亿|百亿|千亿|兆)/
  const match = res.match(regex)
  // 当字符串含有亿 万 单位才需要转化
  if (typeof res === 'string' && match) {
    for (const key in numberMap) {
      if (res.includes(key)) {
        const value = parseFloat(res) * numberMap[key as keyof typeof numberMap]
        return value
      }
    }
  }
  // 如果没有匹配到特定的表示方式，直接将字符串转化为数字
  return parseFloat(res)
}
