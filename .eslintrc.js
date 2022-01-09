module.exports = {
  extends: ['erb'],
  rules: {
    // suppress for Function type
    '@typescript-eslint/ban-types': 'warn',
    // suppress for see all the classes together, especially database models
    'max-classes-per-file': 'warn',
    // I have my own judge
    'prefer-template': 'off',
    // for test
    'import/first': 'warn',
    '@typescript-eslint/dot-notation': 'warn',
    // suppress database callback
    'no-useless-return': 'off',
    // to make prettier blank lines work
    'prettier/prettier': 'off',
    // deconstruct need
    'prefer-const': 'warn',
    // allow to use _id
    '@typescript-eslint/naming-convention': 'off',
    // allow me to use A._id
    'no-underscore-dangle': 'off',
    // I admit, this is not good
    'consistent-return': 'off',
    // prettier would help me
    quotes: 'off',
    // literal type define need
    '@typescript-eslint/no-redeclare': 'off',
    // I love it, for reduce
    'no-sequences': 'off',
    // I like it
    'no-multi-assign': 'off',
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
    // inflexible
    'import/prefer-default-export': 'off',
    'react/jsx-curly-brace-presence': 'off',
    // 'prettier/prettier': 1,
    'react/destructuring-assignment': 0,
    // since prettier has helped me format, no need to use eslint then
    'max-len': ['off', { code: 120, ignoreComments: true }],

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
  plugins: [],
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
