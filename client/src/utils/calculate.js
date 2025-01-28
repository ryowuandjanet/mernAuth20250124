/**
 * 計算公式：A*(B/C)*D
 * @param {number} A - 第一個數值
 * @param {number} B - 分子
 * @param {number} C - 分母
 * @param {number} D - 第四個數值
 * @returns {number} 計算結果，保留兩位小數
 */
export const calculateFormula = (A, B, C, D) => {
  // 檢查參數是否為有效數字
  if (
    typeof A !== 'number' ||
    typeof B !== 'number' ||
    typeof C !== 'number' ||
    typeof D !== 'number' ||
    isNaN(A) ||
    isNaN(B) ||
    isNaN(C) ||
    isNaN(D)
  ) {
    return 0;
  }

  // 檢查除數是否為 0
  if (C === 0) {
    return 0;
  }

  // 計算公式並四捨五入到小數點後兩位
  const result = A * (B / C) * D;
  return Math.round(result * 100) / 100;
};

/**
 * 將數值轉換為坪數 (平方公尺 * 0.3025)
 * @param {number} value - 要轉換的數值（平方公尺）
 * @returns {number} 轉換後的坪數，保留兩位小數
 */
export const convertToPing = (value) => {
  // 檢查參數是否為有效數字
  if (typeof value !== 'number' || isNaN(value)) {
    return 0;
  }

  // 計算並四捨五入到小數點後兩位
  return Math.round(value * 0.3025 * 100) / 100;
};
