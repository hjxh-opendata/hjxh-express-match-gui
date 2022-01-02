/**
 * Base webpack config used across other specific configs
 */
import webpack from 'webpack';

import { dependencies as externals } from '../../release/app/package.json';

import webpackPaths from './webpack.paths';

const configuration: webpack.Configuration = {
  externals: [
    ...Object.keys(externals || {}),

    // for prisma build
    // https://github.com/prisma/prisma/issues/6564#issuecomment-899013495
    {
      _http_common: '_http_common',
    },
  ],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
          },
        },
      },
      // Markdown
      {
        test: /\.(md|markdown)/i,
        use: 'raw-loader',
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
