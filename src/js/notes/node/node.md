# node 笔记

## this 问题

node 解释环境中打印 this 是指代 global
如果再文件中使用 this，则 this 指向为 module.exports 默认为 {}。如果需要使用 global，可以直接使用 global。

## 全局属性

全局属性分为 global 上的属性和 Commonjs 规范形成的属性。

Commonjs 规范形成的全局属性：

- \_\_dirname: 当前文件绝对路径
- \_\_filename: 当前文件名称
- require: 文件引用
- exports: 指向 module.export
- module:

global 上的重要的特殊属性有：

### Buffer: 二进制信息

### process: 代表进程可以获取运行时的一些环境与参数

- process.platform: 运行平台
- process.memoryUsage: 内存管理
- process.chdir: 修改目录
- process.cwd: 当前运行目录
- process.env: 环境变量（获取当前系统的所有环境变量）可以配合 corss-env 来进局部添加环境变量
- process.argv: 用户执行时候传递的参数[0]:node 环境地址，[1]: 可执行文件 可以配合 commander 来进行解析

```js
const program = require("commander);
program.option('-p,--port <v>', 'set port');
program.command('do').description('desc').action(() => {console.log('do someting')});
program.on('--help', () => {console.log('do sometiong when after --help')}) // 监听事件执行回调
program.parse(process.argv);
```

- process.nextTick: 注册微任务执行以前调用的回调函数

## 模块化（commonjs）

定义：

- 每个文件都是一个模块
- 模块之间内容相互独立，如果希望变量被使用，可以用 module.exports 导出变量。
- 如果另一个模块想要使用这个模块导出的结果，需要使用 require 语法引用。

实现方法：详见 23-commonjs.js

## EventLoop

### 浏览器环境

#### 宏任务

宿主环境提供的任务（如：执行栈，setTimeout，messageChannel）

#### 微任务

语言本身提供的任务（如：Promise.prototype.then 的回调）

#### 流程：

主进程执行栈 =[执行完毕]=> 微任务 =[清空]=> [GUI 渲染进程(可能不会调度)] ==> 宏任务 =[取出一个]=> 主进程执行栈 =[循环]=>

### node 环境

#### 特点：

具有多个宏任务队列
timers: 定时器
pending callbacks: 待定回调（上一轮 poll 回调没有执行完毕的，在这里执行）
idel, prepare: 系统调度
poll: 轮询（异步回调处理）
check: 用来存储 setImmediate 回调
close callbacks: 一些关闭方法

#### 过程：

一次从上到下执行主栈代码，然后把这些回调放入相应队列
主栈执行结束，从上到下依次清空上面的宏任务队列
每调用一个宏任务后都会清空一个微任务（10 以前的版本会清空宏任务队列后清空微任务队列）
在 poll 阶段会检查 setImmediate 队列是否有内容（check），有内容清空，无内容阻塞
待定时器有完成的回调，继续去处理 timers 的回调

#### process.nextTick

不算事件环一部分，会在微任务以前清空 nextTick 回调队列

#### 一个特殊情况

setImmediate 可能会在 setTimeout(cb, 0) 之前执行
因为 setTimeout 的时间会随性能原因分配，如果主栈中，setImmediate 写在 setTimeout，则 setImmediate 可能会比 setTimeout 先执行
