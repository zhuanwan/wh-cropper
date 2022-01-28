import Cropper from './cropper'

export default {
  // type===1,图片完全显示在容器内
  setImageDataTypeOne: function (this: Cropper) {
    const { naturalWidth, naturalHeight, naturalRatio } = this.initialImageData
    const { width, height, ratio } = this.containerData

    let scale = 1
    // 如果图片大于容器
    if (naturalWidth > width || naturalHeight > height) {
      // 如果图片长宽比 大于 容器长宽比，则按 图片宽度 来计算
      if (naturalRatio >= ratio) {
        scale = width / naturalWidth
      } else {
        scale = height / naturalHeight
      }
    }

    const imgWidth = naturalWidth * scale
    const imgHeight = naturalHeight * scale
    // 图片缩放后宽高
    this.imageData = {
      rotate: 0,
      scale,
      width: imgWidth,
      height: imgHeight,
      left: (width - imgWidth) / 2,
      top: (height - imgHeight) / 2,
    }
  },
  // type===1,裁剪框根据缩放后的图片，以及传入的比例计算裁剪框大小
  setCropBoxDataTypeOne: function (this: Cropper) {
    const { width: imageWidth, height: imageHeight } = this.imageData
    const imageRatio = imageWidth / imageHeight
    const { width, height } = this.containerData

    const { aspect = 1 } = this.options
    // 默认裁剪宽高为图片的宽高*0.5
    const baseWidth = imageWidth
    const baseHeight = imageHeight

    let cropWidth = 0
    let cropHeight = 0

    // 如果传入的裁剪长宽比(例:1000/1)比图片的长宽大(例:1/2),说明宽很长,最大为baseWidth,那么以baseWidth计算裁剪高度
    if (aspect >= imageRatio) {
      cropWidth = baseWidth
      cropHeight = baseWidth / aspect
    } else {
      cropHeight = baseHeight
      cropWidth = baseHeight * aspect
    }

    this.cropBoxData = {
      width: cropWidth,
      height: cropHeight,
      ratio: cropWidth / cropHeight,
      left: (width - cropWidth) / 2,
      top: (height - cropHeight) / 2,
    }
  },
  // type===2,图片完全显示在裁剪框内
  setImageDataTypeTwo: function (this: Cropper) {
    const { naturalWidth, naturalHeight, naturalRatio } = this.initialImageData
    const {
      width: cropWidth,
      height: cropHeight,
      ratio: cropRatio,
    } = this.cropBoxData
    const { width: containerWidth, height: containerHeight } =
      this.containerData

    let scale = 1
    let width = 0
    let height = 0

    if (naturalRatio > cropRatio) {
      scale = cropWidth / naturalWidth
    } else {
      scale = cropHeight / naturalHeight
    }

    width = naturalWidth * scale
    height = naturalHeight * scale

    this.imageData = {
      rotate: 0,
      width,
      height,
      scale: scale,
      left: (containerWidth - width) / 2,
      top: (containerHeight - height) / 2,
    }
  },
  // type===3,图片显示原图
  setImageDataTypeThree: function (this: Cropper) {
    const { naturalWidth, naturalHeight } = this.initialImageData
    const { width: containerWidth, height: containerHeight } =
      this.containerData
    this.imageData = {
      rotate: 0,
      width: naturalWidth,
      height: naturalHeight,
      scale: 1,
      left: (containerWidth - naturalWidth) / 2,
      top: (containerHeight - naturalHeight) / 2,
    }
  },
}
