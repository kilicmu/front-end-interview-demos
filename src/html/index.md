## 1. <!DOCTYPE>

HTML5的标准网页声明，必须在HTML文件第一行。
作用：指定浏览器解释器用什么解析这个文档
其他类型：
* BackCompat：怪异模式
* CSS1Compat：标准模式

## 2. head标签中有什么

head是作为一个容器，主要包含用于描述 HTML 文档自身信息（元数据）的标签。这个标签里的内容在一般在页面中不会显示，但是在使用可见标签，则可见标签会被写入body内依然可以在页面中显示。
常见标签：
- title：文档标题
- base：给页面所有相对URL提供一个基础URL（唯一）
- link：加载外部资源
    1. 加载样式表：`<link rel="stylesheet" href="xx.css" type="text/css">`
    2. 用于SEO：`<link rel="canonical" href="...">`
    3. 提供rss订阅：`<link rel="alternate" type="application/rss+xml" title="RSS" href="...">`
    4. 指定页面icon：`<link rel="icon" href="https://xxx.png">`
    5. 开启dns-prefetch：`<link rel="dns-prefetch" href="//xxx.com">`
- style：样式
- meta：页面元信息
    1. charset属性：`<meta charset="UTF-8">`
    2. http-equiv属性：`<meta http-equiv="X-dns-prefetch-control" content="on"/>`开启dns-prefetch
    3. name属性: `<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">`
        - width ：页面宽度，可以是一个正整数；也可以一字符串 "device-width" ，表示跟设备宽度相等。
        - height ：页面高度，可以是一个正整数；也可以一个字符串 "device-height" ，表示跟设备高度相等。
        - initial-scale ：初始缩放比例。
        - minimum-scale ： 最小缩放比例。
        - maximum-scale ： 最大缩放比例。
        - user-scalable ：是否允许用户缩放。
- script：用于嵌入或引用可执行脚本。
    异步加载：
    1. async：无法保证脚本的执行顺序，哪个脚本先下载结束就会先执行。
    2. defer：可以保证脚本的执行顺序就是它们在页面上出现的顺序。
- noscript：如果页面上的脚本类型不受支持或者当前在浏览器中关闭了脚本，则在此中定义脚本未被执行时的替代内容。

## 3. 行内与块级元素

- 行内：a span i img input select b
- 块级：div ul ol li h1~h6 p table
区别：
- 行内：
    1. 设置宽高无效
    2. 对margin仅设置左右方向有效，上下无效
    3. padding设置上下左右都有效，即会撑大空间
    4. 行内元素尺寸由内含的内容决定
    5. 不会自动进行换行
- 块级：
    1. 能够识别宽高
    2. margin和padding的上下左右均对其有效
    3. 可以自动换行
    4. 多个块状元素标签写在一起，默认排列方式为从上至下
- 行内块：
    1. 不自动换行
    2. 能够识别宽高
    3. 默认排列方式为从左到右

## 4. HTML语义化?

就是合适的标签做合适的事情
优点：
1. 有助于架构良好的HTML结构，有利于搜索引擎建立索引，抓取，利于SEO
2. 有利于浏览器解析
3. 有利于构建清晰结构，利于团队开发

## 5. HTML解析流程

整个DOM的解析过程是`顺序`，并且`渐进式`的。
`顺序`指的是从第一行开始，一行一行依次解析；`渐进式`则指得是浏览器会迫不及待的将解析完成的部分显示出来。
具体构建步骤：
1. 浏览器从磁盘或网络读取HTML的原始字节，并根据文件的指定编码（例如 UTF-8）将它们转换成字符串。
2. 将字符串转换成Token，例如：`<html>`、`<body>`等。Token中会标识出当前Token是“开始标签”或是“结束标签”亦或是“文本”等信息。
如下图：
![图片1](https://i.niupic.com/images/2020/10/04/8LrG.png)
3. 生成节点对象并构建DOM
注意：如上文所说，DOM解析是渐进的，所以不是先生成Token再构建DOM，而是再Token生成的过程中不断消耗Token创造节点对象（注意，结束标签不会创造）

## 6. window.onload和DOMContentLoaded的区别？

* 当 DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash。
* 当 onload事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了。

## 7. JS为什么操作DOM的性能差
这种性能瓶颈属于浏览器的性能瓶颈，与JS关系不大。
可以从下面两个方面来看：
1. 浏览器渲染引擎对JS引擎的响应存在性能的损耗（延时）。
2. DOM操作是JS实现，浏览器对DOM操作响应是同步的。
3. 存在重排和重绘问题

## 8. 重排[回流]（reflow）和重绘（repaint）
概念：
* 重排：重新生成布局，重新排列元素。
* 重绘：某些元素的外观被改变。
情景：
* 重排：
    1. 页面初始渲染。
    2. 添加/删除可见的DOM元素
    3. 改变元素位置
    4. 改变元素尺寸，比如边距、填充、边框、宽度和高度等
    5. 改变元素内容，比如文字数量，图片大小等
    6. 改变元素字体大小
    7. 改变浏览器窗口尺寸，比如resize事件发生时
    8. 激活CSS伪类（例如：:hover）
    9. 设置 style 属性的值，因为通过设置style属性改变结点几何样式
    10. 查询某些属性或调用某些计算方法
* 重绘：
    1. 一些不影响几何样式属性

## 9. 重排与重绘的优化

* 样式集中改变（操控class）
* 读写操作分离
* DOM离线（display:none)
* 使用Fragment
* 开启GPU加速（transition、animation、will-change等）

## 10. HTML5新特性
* 语义化标签: headerfooternavsectionarticleaside
* 增强型表单（date，email，number，range，search，tel），FormData类
* 视频和音频：audiovideo
* canvas画布
* SVG图片支持
* 地图支持：Geolocation
* 拖放API：drag
* WebStorage
* WebSocket
* XHR2.0，fetch

## 11. 多标签通信
* 监听storage事件，实现标签通信
* websocket协议
* 添加server轮询
* webworker

## 12. href与src的区别？
href本质上是建立标签与外部资源的关联
src则是需要替代这个标签
所以href获取资源不会阻塞DOM的解析过程，但是src会阻塞渲染进程等待资源的获取
