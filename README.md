# wh-cropper

* 裁剪图片，支持PC、H5  
* 本地选择图片文件或者URL链接
* 平移、缩放、旋转
  

### 用法

```js
let cropper = new Cropper(image, container, {
  aspect: 6 / 4, // 裁剪比例，默认1
  containerWidth: 350, // 容器宽度，默认600
  containerHeight: 350,// 容器高度，默认300
  wheelZoomRatio: 0.1 // 滚轮缩放，默认0.1

  // 每次平移、缩放、旋转触发该方法
  change: () => {
    console.log(cropper)
    console.log(cropper.getPreviewCanvas()) // 预览canvas
    console.log(cropper.getCroppedCanvas()) // 裁剪后的canvas
  },
})
```
### 示例
react示例：https://codesandbox.io/s/crop-react-demo-5v6pg
