module.exports = {
  singleQuote: true,
  printWidth: 80,
  // regex not match: https://stackoverflow.com/a/406408/9422455
  importOrder: [
    '^.*components.*$',
    '^../((?!css).)*$',
    '^./((?!css).)*$',
    '.*css$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
