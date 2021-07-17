const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [{
                //匹配哪些文件
                test: /\.css$/,
                // 使用哪些loader进行处理
                use: [
                    //use数组中loader执行顺序: 从右到左，从下到上，依次执行
                    //在页面中打开时，创建style标签，将js中的样式资源插入进去，添加到head中生效
                    // 'style-loader',
                    //MiniCssExtractPlugin  取代css-loader 作用：提取js中的css成单独文件    
                    MiniCssExtractPlugin.loader,
                    //将css文件变成commonjs模块加载到js中，里面内容是样式字符串
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    //将less文件编译成css文件   
                    //需要下载less-loader和less
                    'less-loader'
                ]
            },
            // 打包其他资源，除了html、js、css资源以外的资源
            {
                //排除html、js、css资源
                exclude: /\.html|js|css|png|jpg|svg$/,
                loader: 'file-loader',
                //配置
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            },
            {
                //处理图片资源
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    //图片大小小于8kb，就会被base64处理
                    //优点：减少请求数量（减轻服务器压力）
                    //缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    //[hash:10] 取图片的hash的前10位   [ext]取文件原来的扩展名

                    esModule: false,
                    outputPath: 'imgs',

                    name: '[hash:10].[ext]'

                }
            },
            {
                test: /\.html$/,
                //处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-withimg-loader',
                options: {
                    esModule: false,
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            //对输出的css文件进行重命名
            filename: 'css/built.css'
        })
    ],
    mode: 'development',
    //开发服务器 DevServer: 用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    //特点: 只会在内存中编译打包，不会有任何输出(一旦终止运行，它会把内存中的东西删掉)
    //启动devServer 指令为: npx webpack server 或npx webpack s
    devServer: {
        //项目构建后路径
        contentBase: resolve(__dirname, 'build'),
        //启动gzip 压缩
        compress: true,
        //端口号
        port: 3000,
        //自动打开浏览器
        open: true
    }
}