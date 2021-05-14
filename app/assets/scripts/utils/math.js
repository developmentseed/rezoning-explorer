/**
 * Returns the sum of an array, after mapping each element to a value using the
 * provided function.
 *
 * @param {array} arr The array of objects to sum
 * @param {function|string} fn The key for the value of the function to
 *                             access it.
 */
export function sumBy(arr, fn) {
  return arr.reduce(
    (acc, val, i, all) =>
      acc + (typeof fn === 'function' ? fn(val, i, all) : val[fn]),
    0
  );
}

/**
 * Divides a number and distributes the remainder.
 * Example 5 / 3 = [2, 2, 1]
 *
 * @param {number} dividend Dividend
 * @param {number} divisor Divisor
 *
 * @return {array}
 */
export function distributedDivision(dividend, divisor) {
  const intRes = Math.floor(dividend / divisor);
  const reminder = dividend % divisor;
  return Array.from({ length: divisor }).map((_, i) =>
    i < reminder ? intRes + 1 : intRes
  );
}
