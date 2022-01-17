module.exports = {
  singleQuote: true,
  printWidth: 100,
  // regex not match: https://stackoverflow.com/a/406408/9422455
  importOrder: [
    '.*@types.*',
    '^../((?!css).)*$',
    '^.*components.*$',
    '^./((?!css).)*$',
    '.*css$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
