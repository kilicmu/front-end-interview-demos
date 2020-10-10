# HTTP

## HTTP 的演化过程

* HTTP 0.9:
    只接受GET一种请求方法，没有在通讯中指定版本号，且不支持请求头。由于该版本不支持POST方法，因此客户端无法向服务器传递太多信息。
    
* HTTP 1.0: 
    这是第一个在通讯中指定版本号的HTTP协议版本, 含有大量内容：首部，响应码，重定向，错误，条件请求，内容编码等。
    
* HTTP 1.1：
    默认采用持续连接（Connection: keep-alive），能很好地配合代理服务器工作。还支持以管道方式在同时发送多个请求，以便降低线路负载，提高传输速度。
    改进点：
    
    * 缓存处理（max-age）
    * 改进持久连接（keep-alive）和CDN域名的分片机制
    * 不成熟的http管道化（流水线）
    * 提供虚拟主机支持
    * 支持同时打开多个 TCP 连接
    * 对动态生成的内容完美支持
    * 引入cookie以及安全机制   
    
* HTTP 2.0：

    问题提出：

    * 1.x的多连接实现并发
    * 请求头的重复发送对网络流量的浪费
    * 不支持资源优先级

    改进点：

    * 二进制分帧传输、

      HTTP/2在通信过程中，只会有一个 TCP 连接存在，它承载了任意数量的双向数据流（Stream）。

      每个用户的操作行为被分配了一个**流编号**(stream ID)，这意味着用户与服务端之间建立了一个TCP通道；协议将每个请求分割为二进制的控制帧与数据帧部分。

    * HPACK算法（首部压缩）

      * 客户端与服务端共同维护一个Static Table，包含了常见头部名及常见头部名称与值的组合的代码；
      * 客户端和服务端根据先入先出的原则，维护一份可动态添加内容的共同Dynamic Table
      * 支出哈夫曼编码对首部字段进行压缩

    * 服务端推送

      简单说从客户端多次向服务端请求数据转换为服务端主动提供浏览器渲染页面所需要的资源

* HTTP 3.0

  问题提出：

  * TCP管道传输途中依然存在丢包问题，造成队头阻塞
  * TCP建立连接三次握手，和TSL连接也会耗费较多时间

  解决方案：

  * 基于UDP的QUIC技术：
    * 减少了 TCP 三次握手及 TLS 握手时间（0RTT建连）
    * 改进的拥塞控制（可拔插）。
    * 避免队头阻塞的多路复用。
    * 连接迁移。
    * 面向冗余纠错。

## HTTP请求方法

| 方法    | 作用                                                         |
| ------- | ------------------------------------------------------------ |
| GET     | 请求某一资源                                                 |
| POST    | 向指定URL提交数据                                            |
| PUT     | 向服务器提交数据，但是指定资源位置                           |
| HEAD    | 请求页面首部                                                 |
| DELETE  | 删除服务端某些资源                                           |
| OPTIONS | 获取当前URL支持方法如果请求成功，在Allow的头包含类似`GET,POST`等的信息。 |
| TRACE   | 发送一个远程的，应用层的请求回路                             |
| CONNECT | 请求转换到TCP/IP通道                                         |

## 状态码

* 1xx：
  * 100（Continue）：继续，表示确认，成功返回具体参数信息
  * 101（Upgrade）：升级协议
* 2xx:
  * 200（OK）：返回正常信息
  * 201（No Content）：请求成功，服务器创建新的资源
  * 202（Partial Content）：接收请求，未处理
* 3xx：
  * 301（Moved Permanently）：永久重定向（搜索引擎在抓取新内容的同时也将旧的网址交换为重定向之后的网址）
  * 302（Found）：临时重定向（搜索引擎会抓取新的内容而保存旧的网址）
  * 303（See Other）：临时重定向并改为GET请求
  * 304（Not Modified）：If-Match，If-Modified-Since，If-None-Match...等不满足条件
  * 307（Temporary Redirect）：临时重定向并不更改POST为GET请求
* 4xx：
  * 400（Bad Request）：请求报文存在语法错误
  * 401（Unauthorized）：用户认证失败（JWT、BASIC）
  * 403（Forbidden）：请求被拒绝
  * 404（Not Found）：请求资源不存在
* 5xx：
  * 500（Internal Server Error） ：服务器正在执行请求时发生错误。
  * 503 （Service Unavailable） ：服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

## 常见HTTP字段

* 请求Accept -> 响应Content-Type：表示收到的数据格式
* 请求Accept-Encoding -> 响应Accept-Encoding：采用什么样的压缩方式
* 请求Accept-language -> 响应Content-Language：支持语言
* 请求Accept-Charset -> 响应Content-Charset：指定编码
* 请求Cookie：给服务端的Cookie信息
* 请求Authorization：服务端验证信息
* 请求If（-None）-Match：比较实体（Etag）
* 请求Proxy-Authorization：代理服务器要求认证信息
* 响应Set-Cookie：设置服务端存储的cookie信息
* 响应ETag：资源匹配信息
* 响应Vary，代理服务器的缓存信息
* 响应Last-Modified：资源最后修改时间
* 响应Location：指定客户端重定向的URI
* 响应Server：HTTP服务器安装信息

## Cookie

### 概念：	

​	由于HTTP为无状态协议，某些[网站](https://zh.wikipedia.org/wiki/网站)为了辨别用户身份而储存在用户本地终端（Client Side）上一小块数据，之后浏览器会保存Cookie 的值，当再次向同一个服务器发起请求时，会携带之前保存的 Cookie。

### 作用：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

### 存储格式：

`cookie-name=cookie-value`

### 使用方法：

服务器通过该头部告知客户端保存 Cookie 信息。

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[页面内容]
```

### 生命周期：

* 会话型：浏览器关闭之后它会被自动删除，不需要指定过期时间（`Expires`）或者有效期（`Max-Age`）
* 持久型： Cookie 的生命周期取决于过期时间（`Expires`）或有效期（`Max-Age`）指定的一段时间。

> ```html
> Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
> ```

### 访问控制：

* Secure：Cookie应当通过HTTPS请求发送给服务端
* HttpOnly：Cookie不可被JS访问（document.cookie）

### 作用域：

* Domain：指定了哪些主机可以接受 Cookie，默认为 [origin](https://developer.mozilla.org/zh-CN/docs/Glossary/源)，**不包含子域名**。如果指定了Domain，则一般包含子域名。

* Path：此标识指定了主机下的哪些路径可以接受 Cookie

  例如，设置 `Path=/docs`，则以下地址都会匹配：

  - `/docs`
  - `/docs/Web/`
  - `/docs/Web/HTTP`

* SameSite Attribute

  * Strict：当跨站时，发送请求不会带上 Cookie。仅当与当前页面属于同个站点时，才会携带 Cookie。
  * Lax：与 **`Strict`** 类似，但用户从外部站点导航至URL时（例如通过链接）除外。
  * None：允许任意站点请求携带 Cookie。但是需要额外带上 Secure 属性。





## 参考文献：

[超文本傳輸協定(wiki)](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)

[科普：QUIC协议原理分析](https://zhuanlan.zhihu.com/p/32553477)

[HTTP cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)

