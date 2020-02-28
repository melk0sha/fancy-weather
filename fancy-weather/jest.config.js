module.exports = {
    roots: [
      '<rootDir>/src',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
    moduleFileExtensions: [
      'js',
    ],
    transformIgnorePatterns: ["/node_modules/(?!deck\.gl)"]
};