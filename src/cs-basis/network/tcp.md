## TCP相关问题
#### 1.三次握手
老问题了，不说了

#### 2.为什么三次握手，两次？四次？
TCP的链接本质上就是确定————用于保证可靠性和流控制信息，包括Socket，序列号，窗口大小。

所以TCP三次握手本质就是要解决上面的问题。

使用三次握手可以很好解决两个问题：
* 确认序列号
* 控制废弃链接的创建

至于具体如何做到的，我们慢慢说：

序列号可以做什么？

发送方：
1. 根据ACK，判断丢包，重传

接收方：
1. 数据的确认
2. 舒珊珊的整理
3. 数据的去重

为什么不是四次握手：

理论上是四次：
1. 客户端发送SYN + SEQ控制信息
2. 服务端发送ACK(SEQ+1)回应
3. 服务端发送SYN + SEQ请求建立连接
4. 客户端回应ACK(SEQ+1)，发送对应的ACK

但是！TCP支持同时发送SYN与ACK，所以中间的两步在实际应用中将被合并成一步！！！

同时，在握手的时候双方通过SEQ确认了相应的数据包序列号。

为什么不是两次握手？

首先思考，如果两次握手会有什么问题？

是的，无法断开连接。

有人说，这不是无所谓吗。实际不然，网络是一个很复杂的系统，其中存在大量的延迟或丢包问题。

TCP使用一个无法拒绝连接，大量的延迟连接会被创立，这些连接都是无意义的，只会浪费网络性能。

有人说，可以把断开连接这个任务交给服务端做啊？

那么就又存在一个问题————服务端如何判断一个连接是否是无效的？？？显然，只有让客户端去选择是否拒绝连接的建立，因为只有客户端知道自己发送的这个连接是否是一个已经过期的链接。

这就是为什么不用两次和四次的真正原因。

### TCP实际使用有什么问题？

1. 建立慢（不用说）
2. 弱网性能差（这个拉出来讨论一下）

先说结论：TCP拥塞避免算法，是三次握手是导致弱网性能差的原因

因为TCP的丢包会造成拥塞避免算法的启动，而慢重传会对发送数据量进行限制。TCP无法判断丢包的原因是什么。

所以它会将网络状况差造成的丢包，当做是网络拥塞处理，所以造成了弱网状态下，网络中数据的吞吐量大量降低。