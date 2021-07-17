/**
 * index.js : webpack入口起点文件
 * 
 * 
 * 1. 运行指令:
 * 开发环境: webpack ./src/index.js -o ./build/运行的build.js --mode=development
 *      webpack 会以./src/index.js 为入口文件开始打包，打包后输出到 ./build/build.js
 *      整体打包环境，是开发环境。
 * 生产环境：webpack ./src/index.js -o ./build/build.js --mode=production
 *      webpack 会以./src/index.js 为入口文件开始打包，打包后输出到 ./build/build.js
 *      整体打包环境，是生产环境。(会压缩js代码)
 * 2. 结论：
 *  2.1 webpack可以处理js/json,不能处理css/img等其他资源
 *  2.2 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
 *  2.3 生产环境比开发环境多一个压缩js代码 
 */
import data from './data.json'
// import './index.css'
console.log(data);

function add(a, b) {
    return a + b;
}
console.log(add(1, 2));