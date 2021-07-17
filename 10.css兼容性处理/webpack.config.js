//生产环境基本配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
    //设置nodejs环境变量： 决定使用browserslist的哪个环境
process.env.NODE_ENV = "development"
const CommonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    /**
     * css兼容性处理: postcss库 ----> postcss-loader  post-prest-env
     *  插件作用： 帮postcss找到package.json中browserslist里的配置，通过配置加载指定的css兼容性样式
                *    "browerslist": {
                * //开发环境： 需设置node环境变量： process.env.NODE_ENV = "development"
                        "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                        ],
                        //生产环境： 默认是生产环境
                        "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all "
                        ]
                    }
     */
    //使用loader的默认配置
    // 'postcss-loader',
    //修改loader配置
    {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [
                    require("postcss-preset-env")(),
                ]
            }
        }
    }
]
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
                    ...CommonCssLoader
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    ...CommonCssLoader,
                    //将less文件编译成css文件   
                    //需要下载less-loader和less
                    'less-loader'
                ]
            },
            // 打包其他资源，除了html、js、css资源以外的资源
            {
                //处理其他文件
                exclude: /\.(html|js|css|png|jpg|svg|gif|less)/,
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
            template: './src/index.html',
            //压缩html文件
            minify: {
                //压缩空格
                collapseBooleanAttributes: true,
                //去除注释
                removeComments: true
            }

        }),
        new MiniCssExtractPlugin({
            //对输出的css文件进行重命名
            filename: 'css/built.css'
        }),
        //压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    //自动压缩js
    mode: 'production',
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