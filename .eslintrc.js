module.exports = {
  extends: 'erb',
  rules: {
    // when hook async updates, then need
    '@typescript-eslint/no-shadow': 'off',
    // I like no return assign, since shorter!
    'no-return-assign': 'off',
    // inflexible
    'import/no-named-as-default': 'off',
    // annoying
    '@typescript-eslint/ban-ts-comment': 'off',
    // while(A = B), it's flexible
    'no-cond-assign': 'off',
    'import/prefer-default-export': 'warn',
    'react/jsx-curly-brace-presence': 'off',
    // 'prettier/prettier': 1,
    'react/destructuring-assignment': 0,
    'max-len': ['warn', { code: 120, ignoreComments: true }],

    // refer: https://eslint.org/docs/2.0.0/rules/semi
    // semi: [2, 'always', { omitLastInOneLineBlock: true }],
    semi: 'off',

    // for markdown components use
    'react/jsx-props-no-spreading': 'off',
    // for console use
    'no-console': 'off',

    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
