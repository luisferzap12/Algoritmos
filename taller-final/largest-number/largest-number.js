/**
 * 179. Largest Number
 * https://leetcode.com/problems/largest-number/
 *
 * Familia: ordenamiento (la clave).
 * La clave no es el valor numérico: a va antes que b cuando la
 * concatenación "a+b" (como cadenas) es mayor que "b+a". Con esa
 * clave, un sort normal arma el número más grande posible.
 *
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
    const strs = nums.map(String);

    strs.sort((a, b) => {
        const ab = a + b;
        const ba = b + a;
        if (ab > ba) return -1; // a+b es mayor: a va primero
        if (ab < ba) return 1;  // b+a es mayor: b va primero
        return 0;
    });

    // si el número más grande quedó en "0", todos son cero -> "0", no "000..."
    if (strs[0] === '0') return '0';

    return strs.join('');
};

module.exports = largestNumber;
