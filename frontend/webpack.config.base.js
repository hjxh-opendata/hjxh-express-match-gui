import path from "path";
const distPath = path.resolve("./dist");

export const basicConfig = {
  output: {
    path: distPath,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        use: "source-map-loader",
        enforce: "pre", // todo: 我也不知道这个到底有啥用
      },

        {
            test: /\.s[ac]ss$/i,
            use: [
                // 将 JS 字符串生成为 style 节点
                'style-loader',
                // 将 CSS 转化成 CommonJS 模块
                'css-loader',
                // 将 Sass 编译成 CSS
                'sass-loader',
            ],
        },

        // {
        //     test: /\.less$/,
        //     exclude : '/node_modules',
        //     use: [
        //         {
        //             loader: 'style-loader'
        //         },
        //         {
        //             loader: 'css-loader',
        //             options: {
        //                 importLoaders: 1
        //             }
        //         },
        //         {
        //             loader: 'postcss-loader',
        //             options: {
        //                 ident: 'postcss',
        //                 plugins: (loader) => [
        //                     require('postcss-import')({ root: loader.resourcePath }),
        //                     require('postcss-cssnext')(),
        //                     require('autoprefixer')(),
        //                     require('cssnano')()
        //                 ]
        //             }
        //         },
        //         {
        //             loader: 'less-loader',  //
        //             options: {
        //                 importLoaders: 1
        //             }
        //         }
        //     ]
        // }
    ],
  },
};

export default basicConfig;

