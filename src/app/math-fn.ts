export interface MathFnGroup {
  title: string;
  fnList: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

export const fnGroups: MathFnGroup[] = [
  {
    title: 'Arithmetic',
    fnList: ['abs(x)', 'add(x, y)', 'cbrt(x [, allRoots])', 'ceil(x)', 'cube(x)', 'divide(x, y)', 'dotDivide(x, y)', 'dotMultiply(x, y)',
      'dotPow(x, y)', 'exp(x)', 'expm1(x)', 'fix(x)', 'floor(x)', 'gcd(a, b)', 'hypot(a, b, …)', 'lcm(a, b)', 'log(x [, base])', 'log10(x)',
      'log1p(x)', 'log2(x)', 'mod(x, y)', 'multiply(x, y)', 'norm(x [, p])', 'nthRoot(a)', 'nthRoots(x)', 'pow(x, y)', 'round(x [, n])',
      'sign(x)', 'sqrt(x)', 'square(x)', 'subtract(x, y)', 'unaryMinus(x)', 'unaryPlus(x)', 'xgcd(a, b)']
  },
  {
    title: 'Bitwise',
    fnList: ['bitAnd(x, y)', 'bitNot(x)', 'bitOr(x, y)', 'bitXor(x, y)', 'leftShift(x, y)', 'rightArithShift(x, y)',
      'rightLogShift(x, y)']
  },
  { title: 'Combinatorics', fnList: ['bellNumbers(n)', 'catalan(n)', 'composition(n, k)', 'stirlingS2(n, k)'] },
  { title: 'Logical', fnList: ['and(x, y)', 'not(x)', 'or(x, y)', 'xor(x, y)'] },
  {
    title: 'Probability', fnList: ['combinations(n, k)', 'combinationsWithRep(n, k)', 'factorial(n)', 'gamma(n)', 'kldivergence(x, y)', 'multinomial(a)',
      'permutations(n [, k])', 'pickRandom(array)', 'random([min, max])', 'randomInt([min, max])']
  },
  {
    title: 'Statistics', fnList: ['mad(a, b, c, …)', 'max(a, b, c, …)', 'mean(a, b, c, …)', 'median(a, b, c, …)', 'min(a, b, c, …)', 'mode(a, b, c, …)',
      'prod(a, b, c, …)', 'quantileSeq(A, prob[, sorted])', 'std(a, b, c, …)', 'sum(a, b, c, …)', 'variance(a, b, c, …)']
  },
  {
    title: 'Trigonometry ', fnList: ['acos(x)', 'acosh(x)', 'acot(x)', 'acoth(x)', 'acsc(x)', 'acsch(x)', 'asec(x)', 'asech(x)', 'asin(x)', 'asinh(x)',
      'atan(x)', 'atan2(y, x)', 'atanh(x)', 'cos(x)', 'cosh(x)', 'cot(x)', 'coth(x)', 'csc(x)', 'csch(x)', 'sec(x)', 'sech(x)', 'sin(x)', 'sinh(x)',
      'tan(x)', 'tanh(x)']
  },
  {
    title: 'Utils', fnList: ['clone(x)', 'hasNumericValue(x)', 'isInteger(x)', 'isNaN(x)', 'isNegative(x)', 'isNumeric(x)', 'isPositive(x)',
      'isPrime(x)', 'isZero(x)', 'numeric(x)', 'typeOf(x)']
  },
];

export const fnGroupExpo: MathFnGroup[] = [
  {
    title: 'Arithmetic',
    fnList: ['Calculate the absolute value of a number.', 'Add two or more values, x + y.', 'Calculate the cubic root of a value.',
      'Round a value towards plus infinity If x is complex, both real and imaginary part are rounded towards plus infinity.',
      'Compute the cube of a value, x * x * x.', 'Divide two values, x / y.', 'Divide two matrices element wise.',
      'Multiply two matrices element wise.', 'Calculates the power of x to y element wise.', 'Calculate the exponent of a value.',
      'Calculate the value of subtracting 1 from the exponential value.', 'Round a value towards zero.', 'Round a value towards minus infinity.',
      'Calculate the greatest common divisor for two or more values or arrays.', 'Calculate the hypotenusa of a list with values.',
      'Calculate the least common multiple for two or more values or arrays.', 'Calculate the logarithm of a value.',
      'Calculate the 10-base logarithm of a value.', 'Calculate the logarithm of a value+1.', 'Calculate the 2-base of a value.',
      'Calculates the modulus, the remainder of an integer division.', 'Multiply two or more values, x * y.',
      'Calculate the norm of a number, vector or matrix.', 'Calculate the nth root of a value.', 'Calculate the nth roots of a value.',
      'Calculates the power of x to y, x ^ y.', 'Round a value towards the nearest integer.', 'Compute the sign of a value.',
      'Calculate the square root of a value.', 'Compute the square of a value, x * x.', 'Subtract two values, x - y.',
      'Inverse the sign of a value, apply a unary minus operation.', 'Unary plus operation.',
      'Calculate the extended greatest common divisor for two values.']
  },
  {
    title: 'Bitwise',
    fnList: ['Bitwise AND two values, x & y.', 'Bitwise NOT value, ~x.', 'Bitwise OR two values, x | y.', 'Bitwise XOR two values, x ^ y.',
      'Bitwise left logical shift of a value x by y number of bits, x << y.', 'Bitwise right arithmetic shift of a value x by y number of bits, x >> y.',
      'Bitwise right logical shift of value x by y number of bits, x >>> y.']
  },
  {
    title: 'Combinatorics', fnList: ['The Bell Numbers count the number of partitions of a set.',
      'The Catalan Numbers enumerate combinatorial structures of many different types.', 'The composition counts of n into k parts.',
      'The Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets.']
  },
  { title: 'Logical', fnList: ['Logical and.', 'Logical not.', 'Logical or.', 'Logical xor.'] },
  {
    title: 'Probability', fnList: ['Compute the number of ways of picking k unordered outcomes from n possibilities.',
      'Compute the number of ways of picking k unordered outcomes from n possibilities, allowing individual outcomes to be repeated more than once.',
      'Compute the factorial of a value Factorial only supports an integer value as argument.',
      'Compute the gamma function of a value using Lanczos approximation for small values, and an extended Stirling approximation for large values.',
      'Calculate the Kullback-Leibler (KL) divergence between two distributions.', 'Multinomial Coefficients compute the number of ways of picking a1, a2, .',
      'Compute the number of ways of obtaining an ordered subset of k elements from a set of n elements.', 'Random pick one or more values from a one dimensional array.',
      'Return a random number larger or equal to min and smaller than max using a uniform distribution.',
      'Return a random integer number larger or equal to min and smaller than max using a uniform distribution.']
  },
  {
    title: 'Statistics', fnList: ['Compute the median absolute deviation of a matrix or a list with values', 'Compute the maximum value of a matrix or a list with values.',
      'Compute the mean value of matrix or a list with values.', 'Compute the median of a matrix or a list with values.',
      'Compute the minimum value of a matrix or a list of values.', 'Computes the mode of a set of numbers or a list with values(numbers or characters).',
      'Compute the product of a matrix or a list with values.', 'Compute the prob order quantile of a matrix or a list with values.',
      'Compute the standard deviation of a matrix or a list with values.', 'Compute the sum of a matrix or a list with values.',
      'Compute the variance of a matrix or a list with values.']
  },
  {
    title: 'Trigonometry ', fnList: ['Calculate the inverse cosine of a value.', 'Calculate the hyperbolic arccos of a value, defined as acosh(x) = ln(sqrt(x^2 - 1) + x).',
      'Calculate the inverse cotangent of a value, defined as acot(x) = atan(1/x).',
      'Calculate the hyperbolic arccotangent of a value, defined as acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2.',
      'Calculate the inverse cosecant of a value, defined as acsc(x) = asin(1/x).',
      'Calculate the hyperbolic arccosecant of a value, defined as acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1)).',
      'Calculate the inverse secant of a value.', 'Calculate the hyperbolic arcsecant of a value, defined as asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x).',
      'Calculate the inverse sine of a value.', 'Calculate the hyperbolic arcsine of a value, defined as asinh(x) = ln(x + sqrt(x^2 + 1)).',
      'Calculate the inverse tangent of a value.', 'Calculate the inverse tangent function with two arguments, y/x.',
      'Calculate the hyperbolic arctangent of a value, defined as atanh(x) = ln((1 + x)/(1 - x)) / 2.', 'Calculate the cosine of a value.',
      'Calculate the hyperbolic cosine of a value, defined as cosh(x) = 1/2 * (exp(x) + exp(-x)).', 'Calculate the cotangent of a value.',
      'Calculate the hyperbolic cotangent of a value, defined as coth(x) = 1 / tanh(x).', 'Calculate the cosecant of a value, defined as csc(x) = 1/sin(x).',
      'Calculate the hyperbolic cosecant of a value, defined as csch(x) = 1 / sinh(x).', 'Calculate the secant of a value, defined as sec(x) = 1/cos(x).',
      'Calculate the hyperbolic secant of a value, defined as sech(x) = 1 / cosh(x).', 'Calculate the sine of a value.',
      'Calculate the hyperbolic sine of a value, defined as sinh(x) = 1/2 * (exp(x) - exp(-x)).', 'Calculate the tangent of a value.',
      'Calculate the hyperbolic tangent of a value, defined as tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1).'
    ]
  },
  {
    title: 'Utils', fnList: ['Clone an object.', 'Test whether a value is an numeric value.', 'Test whether a value is an integer number.',
      'Test whether a value is NaN (not a number).', 'Test whether a value is negative: smaller than zero.', 'Test whether a value is an numeric value.',
      'Test whether a value is positive: larger than zero.', 'Test whether a value is prime: has no divisors other than itself and one.',
      'Test whether a value is zero.', 'Convert a numeric input to a specific numeric type: number, BigNumber, or Fraction.', 'Determine the type of a variable.']
  },

];