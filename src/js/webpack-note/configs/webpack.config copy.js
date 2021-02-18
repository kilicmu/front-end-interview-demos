const { resolve } = require("path")
const webpack = require("webpack")
const loader = require("./loaders/raw-loader")
const glob = require('glob');
const HTMLWebpackPlugin = require("html-webpack-plugin") // html配置
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin"); // cdn动态引入配置 
const FileManagerPlugin = require("filemanager-webpack-plugin"); // 文件控制
const CopyWebpackPlugin = require("copy-webpack-plugin") // 文件拷贝
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 压缩文件清理
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css 合并
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // css 压缩
const TerserPlugin = require("terser-webpack-plugin"); // js压缩
const PurgeCssPlugin = require("purgecss-webpack-plugin") // css 精简类似tree-shark

//动态配置cdn
const env = process.env.NODE_ENV;
const lodashCDN = env === "development" ? "http://localhost:8080/lodash.js" : "cdn path"
const isProduction = () => env === "production";
module.exports = (env1) => {
    // console.log(env1)
    return {
        /**
         * mode与env区别：都可以通过process.env.NODE_ENV, mode可以在模块使用，env只可以在config里面使用
         */
        /**
         * development：process.env.NODE_ENV=development, 启动NamedChunksPlugin 和 NamedModulesPlugin
         * production:process.env.NODE_ENV=production, 启动：FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin, UglifyJsPlugin
         */
        mode: process.env.NODE_ENV === "development" ? "development" : "production", // production
        /**
         * eval：性能好, 可以缓存source-map
         * source-map: 生成.map映射文件(包含行列信息)
         * cheap-source-map: 不包含列信息，不包含loader的sourcemap，较轻量
         * cheap-moudle-source-map: 包含loader的sourcemap
         * inline-source-map: 不生产map文件，直接内嵌
         * hidden-source-map: 线上环境，打包sourcemap但是将sourcemap放入本地服务器，节主fiddler将浏览器对map的请求拦截到本地服务器，使用插件 webpack.SourceMapDevToolPlugin
        */
        devtool: "source-map",
        optimization: {
            minimize: isProduction(),
            minimizer: isProduction() ? [new TerserPlugin()] : [] // mode=production自动压缩代码
        },
        entry: {
            // 每个entry会生成一个chunk，每个chunk会生成bundle
            main: resolve(__dirname, "src/index.js"),
        },
        output: {
            path: resolve(__dirname, 'dist'),
            filename: '[name].[hash:10].js',
            // 代码块name来源：
            // 非入口代码块有两个来源：
            /**
             * 1. 代码分割 vender common
             * 2. 懒加载 import()
             */
            chunkFilename: '[name].[hash:10].js',
            publicPath: '/' // 指定打包文件的路径(src=`${publickPath}+${filename}`) 可以指定cdn地址
        },
        module: {
            rules: [
                { test: /\.txt$/, use: resolve(__dirname, 'loaders', 'raw-loader.js') },
                { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', "postcss-loader", { loader: "px2rem-loader"/*自动转换rem*/, options: { remUnit: 75 } }] }, // 使用postcss-loader解决兼容
                { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { esModule: false/*解决es warn */ } }, "postcss-loader", "sass-loader"] },
                { test: /\.less$/, use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { esModule: false } }, "postcss-loader", "less-loader"] },
                {
                    test: /\.(jpg|png|gif|bmp)$/, use: [{
                        loader: 'url-loader',
                        options: {
                            name: '[hash:10].[ext]',
                            limit: 8 * 1024, // 文件小于8k转换为base64
                            outputPath: "images",
                            publicPath: '/images'
                        }
                    }]
                },
                { test: /\.html$/, use: "html-loader" },
                // 配置eslint代码检查
                { test: /\.jsx?$/, loader: 'eslint-loader', enforce: 'pre'/*优先执行*/, options: { fix: true }, exclude: /node_modules/ },
                // js兼容处理 （babel）
                // yarn add babel-loader @babel/core @babel/core @babel/preset-env @babel/preset-react @babel/polyfill -D
                // yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D > 这两个是处理装饰器和对象
                // {
                //     test: /\.jsx?$/, use: [
                //         {
                //             loader: "babel-loader",
                //             options: {
                //                 presets: [
                //                     ["@babel/preset-env", {  // 优化polyfill加载，最优方案，引入https://polyfile.io/v3/polyfill.min.js
                //                         // useBuiltIns: false, // 按需加载polyfill: usage, 不按需加载使用false
                //                         // corejs: { version: 3 }, // corejs版本号
                //                         // targets: {            // 指定兼容版本
                //                         //     chrome: '60',
                //                         //     firefox: '60',
                //                         //     ie: '9',
                //                         //     safari: '10'
                //                         // }
                //                         // useBuiltIns: "usage", // entry,手动引入， usage：按需引入
                //                         // 如果使用2，引入 import "@babel/polyfill" 体积较小
                //                         // 如果使用3，引入 import "core-js/stable"; import "regenerator-runtime/runtime";
                //                         // corejs: { version: 3 },
                //                         // targets: ">0.25%"
                //                         // 也可以自己从babel-runtime/core-js/xxx手动引入polyfill，可以使用babel-plugin-transform-runtime 体积较大
                //                     }],
                //                     "@babel/preset-react"
                //                 ],
                //                 plugins: [
                //                     ["@babel/plugin-transform-runtime", { corejs: 3, helpers: true/**/, regenerator: true }], //自动从引入babel-runtime
                //                     ["@babel/plugin-proposal-decorators", { legacy: true }], // 使用stage1 语法
                //                     ["@babel/plugin-proposal-class-properties", { loose: true }] // 类的属性将使用赋值表达式而不是definePrototype
                //                 ],
                //                 include: /src/ // 优化不babel编译node_modules
                //             }
                //         }
                //     ]
                // }
            ]
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: "./src/index.html",
                minify: { // 启动html压缩
                    collapseWhitespace: true, // 去掉空格
                    removeComments: true      // 去掉注释
                }
            }),
            // 配置线上环境的sourcemap映射
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // 原始文件名
                append: '\n//# sourceMappingURL=http://127.0.0.1:8080/sourcemap/[url]', // 生产环境不应该有append,或使用hidden-source-map
            }),
            // yarn add filemanager-webpack-plugin -D
            new FileManagerPlugin({
                events: {
                    onEnd: {
                        copy: [
                            { source: './dist/**/*.map', destination: './sourcemap' } // 将sourcemap放入测试服务器
                        ],
                        delete: ['./dist/**/*.map']
                    }
                }
            }),
            // 自动引入库，注入到函数执行上下文，但是无法全局引用
            new webpack.ProvidePlugin({
                _: "lodash"
            }),
            // 根据是否使用lodash引入lodash的cdn脚本
            new HtmlWebpackExternalsPlugin({
                externals: [
                    {
                        module: "lodash",
                        global: "_",
                        entry: "https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js" // 这里可以用上面定义的cdn地址
                    }
                ]
            }),
            // 定义全局可使用的环境变量
            new webpack.DefinePlugin({
                // DEVELOPMENT: !!env.production,
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: resolve(__dirname, "src/assets"),
                        to: resolve(__dirname, "dist/assets")
                    }
                ]
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["**/*"]
            }),
            // 收集样式文件生成一个样式文件，用HtmlWebpackPlugin插入html
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            isProduction() && new OptimizeCssAssetsWebpackPlugin(), // css压缩器
            // 解决css未使用问题
            new PurgeCssPlugin({
                paths: glob.sync(resolve(__dirname, 'src') + '/**/*', { nodir: true })
            })

        ].filter(Boolean),
        devServer: {
            contentBase: resolve(__dirname, "assets"), // 设置静态文件目录（output找不到，则来这个目录找）
            publicPath: '/', // 指定静态目录
            port: 8080,
            // open: true, // 打开浏览器
            compress: true, // 启动gzip压缩
            writeToDisk: true, // 打包后文件写入硬盘一份
            before(app) { // devServer的express服务器
                app.get("/api/data", (req, res) => { res.json({ id: 1 }) })
            },
            proxy: {
                '/api': {
                    target: "http://localhost:3000",
                    pathRewrite: {
                        "^/api": ""
                    }
                },
            }
        },
        watch: true, // 自动编译（不是hmr）
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300, // 编译延迟(防抖)
            poll: 1000 // 轮询 1000/s
        }
        // 当使用cdn外链，可以指定external来不再打包lodash
        // external: {
        //     "lodash": _
        // }
    }
}