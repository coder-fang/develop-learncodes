/**
 * HMR:hot module replacement 热模块替换/模块热替换
 * 作用: 一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块）
 * 极大提升构建速度
 * 
 * 样式文件： 可以使用hmr 功能：因为style-loader内部实现了
 * js文件： 默认不能使用hmr功能 ----> 需要修改js代码，添加支持hmr功能的代码
 * html文件： 默认不能使用hmr功能，同时会导致问题：html文件不能热更新 (不用做hmr功能)
 * 注意： hmr功能对js的处理，只处理非入口js文件的其他文件
 *      解决：修改entry入口，将html文件引入。
 */
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
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
                    'style-loader',
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
        open: true,
        //开启HMR功能
        //当修改了webpack配置，新配置要想生效，必须重新开启webpack服务
        hot: true
    },
    devtool: 'source-map'
};
/**
 * source-map：(外部) 一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射可以追踪源代码错误）
 * [inline-|hidden-|eval-][nosources-][cheap-[module-]]scource-map
 * source-map : 错误代码准确信息 和源代码错误位置
 * 
 * inline-source-map: 内联
 *      只生成一个内联source-map,错误代码准确信息 和源代码错误位置
 * hidden-source-map: 外部
 *      错误代码错误原因，但是没有错误位置
 *       不能追踪源代码错误，只能提示到构建后代码的错误位置
 * eval-source-map: 内联
 *      每一个文件都生成对应的source-map,都在eval
 *      错误代码准确信息 和源代码错误位置
 * nosources-source-map:外部
 * 错误代码准确信息，但是没有任何源代码信息
 * cheap-source-map: 外部  
 *  错误代码准确信息 和源代码错误位置
 *  只能精确到行
 * cheap-module-source-map: 外部    
 *     错误代码准确信息 和源代码错误位置
 *   
 * 内联 和外部的区别: 1.外部生成了文件，内联没有 2. 内联构建速度更快 
 * 
 * 开发环境：速度快，调试更友好
 *      速度快（eval>inline>cheap>...）
 *          eval-cheap-source-map
 *          eval-source-map
 *       调试更友好
 *          source-map
 *          cheap-module-source-map
 *          cheap-source-map
 *      ---> eval-source-map (调试更友好) / eval-cheap-module-source-map（性能更好）
 * 生产环境：源代码要不要隐藏，调试要不要更友好
 *         内联会让代码体积变大，所以在生产环境下不用内联
 *          nosources-source-map 全部隐藏
 *          hidden-source-map 只隐藏源代码，会提示构建后代码错误信息
 *      ---> source-map / cheap-module-source-map
 */