# CSS 揭秘总结

## 边框

### 半透明边框问题 ：

desc: 实现一个可以看到 body 背景的边框

tips: background 默认会延伸到 border 下面，需要使用 background-clip 将 background 从 padding 外边沿裁切

```css
.div {
  border: 10px solid hsl(1, 0%, 100%, 0.3);
  background: white;
  background-clip: padding-box;
}
```

### 多重边框问题：

desc: 实现一个多重同心几何图形：

1. 使用 box-shadow

```css
.concentric {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background-color: aquamarine;
  box-shadow: 0 0 0 10px #665, 0 0 0 15px #660, 0 0 0 20px #620;
}
```

2. 使用 outline

warn: 只可以设置一层，且不贴合圆角。但是可以通过 outline-offset 设置动态偏移

```css
.concentric {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background-color: aquamarine;
  border: 10px solid yellow;
  outline: 10px solid green;
}
```

### 背景定位：

实现同一个 box 中图片相对左下角一定距离定位：

1. 通过 background-positionz 增强实现
   tips: background-position 是以 padding-box 为准（防止 border 对图片遮盖）

```css
div {
  background: url(http://csssecrets.io/images/code-pirate.svg) no-repeat bottom
    right #58a; // bottom&right 是用来做兼容的，兼容不支持CSS3的属性
  background-position: right 20px bottom 10px; // CSS3增强偏移

  max-width: 10em;
  min-height: 5em;
  padding: 10px;
  color: white;
  font: 100%/1 sans-serif;
}
```

2. 通过 background-origin :
   tips: background-origin 可以修改 background-position 对其的基准：

```css
div {
  background: url(http://csssecrets.io/images/code-pirate.svg) no-repeat bottom
    right #58a;
  background-origin: content-box;

  max-width: 10em;
  min-height: 5em;
  padding: 10px; // 使用padding控制图片默认位置
  color: white;
  font: 100%/1 sans-serif;
}
```

3. 通过 calc()计算
