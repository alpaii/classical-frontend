// snake_case → camelCase 변환 함수
export const convertSnakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamel(item))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase()) // ✅ 변환
      acc[camelKey] = convertSnakeToCamel(value) // ✅ 재귀적으로 변환 (중첩 객체 대응)
      return acc
    }, {})
  }
  return obj
}
