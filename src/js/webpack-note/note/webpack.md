## hash
hash指文件指纹，一般对应文件后加md5值
一般结合cdn缓存使用文件改变，文件名改变，url地址改变，出发cdn服务器从源服务器拉数据，更新本地缓存
- hash: 每次webpack构建生成的唯一hash
- chunkHash: 根据chunk生成的hash
- contentHash: 根据内容生成的hash，文件内容相同，hash相同（慢一点）

```js
let crypto = require('crypto');
// hash
const hash = crypto.createHash('md5').update("all content").digest('hex');
// chunkHash
const titelContentHash = crypto.createHash('md5').update('content').update('require content').digest('hex');
// contentHash
const contentHash = crypto.createHash('md5').update('content').digest('hex');
```

hash选择：
- 如果内容变化快，且单文件，则使用hash
- 如果多个入口，建议使用chunkhash
- 如果长期缓存，且变化不大，使用contenthash


## tree-shaking 优化bug
防止tree-shaking优化掉css，可以在package.json配置sideEffects: ["**/*.css"]来解决