//引入iconfont样式文件
import './iconfont.css'
import './index.css'
import print from './print'

console.log("js文件重新加载了！！！！");

print();

function add(a, b) {
    return a + b;

}

console.log(add(1, 2))

if (module.hot) {
    //一旦module.hot 为true，说明开启了HMR功能。  
    module.hot.accept('./print.js', function() {
        //方法会监听print.js文件的变化，一旦发生变化，其他模块不会重新打包构建
        //会执行后面的回调函数
        print();
    })

}