const {resolve} = require("path")
const loader = require("./loaders/raw-loader")
const HTMLWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    mode: 'development', // production
    entry: resolve(__dirname, "src/index.js"),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/' // 指定打包文件的路径(src=`${publickPath}+${filename}`)
    },
    module: {
        rules: [
            {test: /\.txt$/, use: resolve(__dirname, 'loaders', 'raw-loader.js')},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', "sass-loader"]},
            {test: /\.less$/, use: ['style-loader', 'css-loader', "less-loader"]},
            {test: /\.(jpg|png|gif|bmp)$/, use: [{
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    limit: 8 * 1024 // 文件小于8k转换为base64
                }
            }]},
            {test: /\.html$/, use: "html-loader"},
            // js兼容处理 （babel）
            // yarn add babel-loader @babel/core @babel/core @babel/preset-env @babel/preset-react @babel/polyfill -D
            // yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D > 这两个是处理装饰器和对象
            {test: /\.jsx?$/, use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", {legacy: true}],
                            ["@babel/plugin-proposal-class-properties", {loose: true}]
                        ]
                    }
                }
            ]}
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devServer: {
        contentBase: resolve(__dirname, "assets"), // 设置静态文件目录（output找不到，则来这个目录找）
        publicPath: '/', // 指定静态目录
        port: 8080,
        // open: true, // 打开浏览器
        compress: true, // 启动压缩
        writeToDisk: true, // 打包后文件写入硬盘一份
    }
}