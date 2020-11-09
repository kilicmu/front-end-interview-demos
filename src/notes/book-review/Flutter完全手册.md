# Flutter完全手册笔记

## 一、架构概览

![widget架构](https://user-gold-cdn.xitu.io/2019/2/14/168eb1ddc1f9a6c0?imageslim)

## 二、组件

### 1. Widget

1. **定义：** Widget 相当于 Android 里的 View，iOS 里的 UIView。

2. **Flutter 的 diff ：**

   标识符：Key

   标识符分类：

   1. Local Key (局部 Key )
      * Object Key：对象做 key
      * ValueKey：使用特定值做 key
      * UniqueKey：唯一 key
   2. Global Key (全局 Key )
      * LabeledGlobalKey：用于调试，不会用来比较 Widget是否变化
      * GlobalObjectKey：将对象作为GlobalKey的值

   作用：类似于 React ，用于 Diff 算法使用。

   流程：

   * 无 key ：

     仅判断 Widget 的 runtimeType 判断 Widget 是否改变

   * 有 key ：

     比较 Key 与 runtimeType 是否相同来判断 Widget 是否改变

3. **分类：**

   #### StatefulWidget：UI 可变的Widget

   * State：

     原型：`State<T extends StatefulWidget>`

     variable：

     * widget：

       用法：`child: Text(widget.content)`

     * context

       用法：`Widget build(BuildContext context) `

     * mounted：boolean

       含义：表示当前 State 是否加载到树里

       注意：> 只用在 mounted 属性为 true 才能使用 mounted 中的方面

     methods：

     * build ---------创建 Widget

     * setState ---------刷新 UI 

       更改数据的值，触发 build 方法，触发重构 Widget，重构 Widget 时候会重新绑定数据，这个时候数据已经发生变化，从而刷新 UI。

     生命周期：

     1. moundted：boolean

        mounted 是 boolean，只有当 mounted 为 true，才能使用 setState()

     2. initState()：

        initState方法为State创建后第一个调用方法，如果重载需要调用方法：`super.initState()`

     3. didChangeDependencies()：

        initState() 方法运行完成后，立即执行此方法。Widget调用后，此方法会调用，如果 Widget 的依赖数据被调用，此方法会执行

     4. build()：

        此方法在didChangeDependencies() 或 didUpdateWidget() 后调用，构建 Widget 

     5. setState()：

        有状态变化，显示调用 setState() 触发重新构建 Widget

     6. didUpdateWidget()：

        当新旧 Widget 可以复用的时候，会调用didUpdateWidget()，此方法调用，会把 Widget 配置赋值给State，相当于重新 initState() ，之后会调用build() 方法。

     7. deactive()：

        State 从树中移除会触发此方法。如果这帧结束前，其他地方使用了这个Widget，此 Widget 会被重新插入树中。

     8. dispose()：

        此方法会在 StatefulWidget 从树中移除时候调用

     9. mounted is false

     10. *reasemble()*

         此方法在开发时，触发 HotReload 时执行此方法，提供在 initState 前准备任何数据前的机会，包括全局变量

   * 实现步骤：

     1. 继承 StatefulWidget
     2. 实现 createState() 方法，返回一个 State

   * 生命周期：

     ![生命周期](https://user-gold-cdn.xitu.io/2019/5/13/16ab1dbc405c19e2?imageslim)

     1. createState()：StatefulWidget 唯一的生命周期

     

   #### StatelessWidget：UI 不可变的Widget

   * 实现：

     1. 首先继承 StatelessWidget。
     2. 必须要实现 `build` 函数，返回一个 Widget。

   * 特点：

     状态不可变，即只有在加载 / 构建 Widget 才绘制一次，不会银用户操作或事件触发重绘。

   * 生命周期：
     
     1. build：构建 [Widget]()

### 2. 文本框

#### i. Text

使用：Text("your text", style: TextStyle())

#### ii. RichTest

一个富文本Text

使用：

```dart
RichText(
    text: TextSpan(children: [
      TextSpan(text: "Hello", style: TextStyle(color: Colors.blue)),
      TextSpan(text: "Flutter", style: TextStyle(color: Colors.red))
    ]),
)
```

###  3. Image

使用：

```dart
Image.asset("images/test-img.jpg", fit: BoxFit.fitWidth),
```



 出默认构造参数的四个构造函数：

* Image.network(url)：从网络加载显示图片
* Image.file(file)：从本地文件加载显示图片
* Image.asset(name)：从Flutter APP的资源文件里加载显示图片
* Image.memory(bytes)：从内存加载显示图片

