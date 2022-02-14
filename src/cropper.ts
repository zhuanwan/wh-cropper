import { FnNamesT, OptionsT } from '../types'
import {
  createImageElement,
  getDistance,
  loadImage,
} from './utils'
import TEMPLATE from './template'
import caculate from './caculate'
import './css/style.less'

import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  NAMESPACE,
  EVENT_TOUCH_START,
  EVENT_TOUCH_MOVE,
  EVENT_TOUCH_END,
  EVENT_WHEEL,
  ACTION_MOVE,
} from './constants'

const DEFAULTS: Partial<OptionsT> = {
  aspect: 1,
  containerWidth: 600,
  containerHeight: 300,
  wheelZoomRatio: 0.1,
}
class Cropper {
  element: string | File
  options: OptionsT
  image!: HTMLImageElement
  initialImageData!: {
    naturalWidth: number
    naturalHeight: number
    naturalRatio: number
  }
  ready: boolean
  container: HTMLElement
  cropper!: HTMLElement
  cropBox!: HTMLElement
  viewBox: any
  face: Element | null | undefined
  containerData!: { width: number; height: number; ratio: number }
  imageData!: {
    scale: number
    rotate: number
    width: number
    height: number
    left: number
    top: number
  }
  onCropStart!: (event: MouseEvent | TouchEvent) => void
  pointers: {
    startX1: number
    startY1: number
    pageX1: number
    pageY1: number
    originScale: number
    pageX2?: number
    pageY2?: number
  }
  startMoving: boolean = false
  onCropMove!: (event: MouseEvent | TouchEvent) => void
  onCropUp!: (event?: MouseEvent | TouchEvent) => void
  cropBoxData!: {
    width: number
    height: number
    ratio: number
    left: number
    top: number
  }
  setImageDataTypeOne: () => void
  setImageDataTypeTwo: () => void
  setCropBoxDataTypeOne: () => void
  setImageDataTypeThree: any
  wheeling: boolean
  onWheel!: (event: WheelEvent) => void
  action: string

  constructor(
    element: string | File,
    container: HTMLElement,
    options: OptionsT
  ) {
    if (!element) {
      throw new Error('第一个参数必须是图片File或者url')
    }
    if (!container) {
      throw new Error('第二个参数必须是容器')
    }
    this.element = element
    this.container = container
    this.ready = false
    this.wheeling = false
    this.pointers = {
      startX1: 0,
      startY1: 0,
      pageX1: 0,
      pageY1: 0,
      originScale: 1,
    }
    this.action = ''
    this.options = {
      ...DEFAULTS,
      ...options,
    }

    // 如果没有传入裁剪的长宽比，默认按容器的长宽比
    const { containerWidth = 600, containerHeight = 300 } = this.options
    if (!this.options.aspect) {
      this.options.aspect = containerWidth / containerHeight
    }

    this.setCropBoxDataTypeOne = caculate.setCropBoxDataTypeOne.bind(this)
    this.setImageDataTypeOne = caculate.setImageDataTypeOne.bind(this)
    this.setImageDataTypeTwo = caculate.setImageDataTypeTwo.bind(this)
    this.setImageDataTypeThree = caculate.setImageDataTypeThree.bind(this)
    this.init()
  }

  // 加载图片，本地图片，线上链接
  init() {
    const done = (res: HTMLImageElement) => {
      this.image = res
      this.start()
    }
    if (this.element instanceof File) {
      var file = this.element
      if (!/^image\//.test(file.type)) {
        return
      }
      createImageElement(file).then((res) => done(res))
    } else {
      loadImage(this.element).then((blob) => {
        createImageElement(blob).then((res) => done(res))
      })
    }
  }

  // 加载完图片后计算容器高，图片高
  start() {
    if (!this.image) {
      return
    }
    const { options } = this
    const { naturalWidth, naturalHeight } = this.image
    // 图片原始宽高
    this.initialImageData = {
      naturalWidth,
      naturalHeight,
      naturalRatio: naturalWidth / naturalHeight,
    }

    const _width = options.containerWidth || CONTAINER_WIDTH
    const _height = options.containerHeight || CONTAINER_HEIGHT
    // 容器宽高
    this.containerData = {
      width: _width,
      height: _height,
      ratio: _width / _height,
    }

    // 设置图片和裁剪框尺寸
    this.setImageDataTypeOne()
    this.setCropBoxDataTypeOne()

    this.build()
    this.bind()
    this.ready = true
    this.triggerOptionsFn('ready')
  }

  // 设置图片显示方式，默认/完整显示/原图
  setType(type: number) {
    switch (type) {
      case 1:
        this.setImageDataTypeOne()
        this.setStyle()
        break
      case 2:
        this.setImageDataTypeTwo()
        this.setStyle()
        break
      case 3:
        this.setImageDataTypeThree()
        this.setStyle()
        break
      default:
        break
    }
  }

  // 创建裁剪内容
  build() {
    const { image, container, containerData } = this
    container.innerHTML = TEMPLATE

    const cropper = container.querySelector(`.${NAMESPACE}-container`)
    const cropBox = cropper?.querySelector(`.${NAMESPACE}-box`)

    this.container = container
    this.cropper = cropper as HTMLElement
    this.cropBox = cropBox as HTMLElement

    image.classList.add(`${NAMESPACE}-img`)
    cropper?.appendChild(image)

    this.cropper.style.width = `${containerData.width}px`
    this.cropper.style.height = `${containerData.height}px`
    this.setStyle()
  }

  setStyle() {
    const { image, imageData } = this
    image.style.transformOrigin = `left top`
    image.style.transform = `translate(${imageData.left}px, ${imageData.top}px) rotate(${imageData.rotate}deg) scale(${imageData.scale})`

    this.cropBox.style.width = `${this.cropBoxData.width}px`
    this.cropBox.style.height = `${this.cropBoxData.height}px`
    this.cropBox.style.left = `${this.cropBoxData.left}px`
    this.cropBox.style.top = `${this.cropBoxData.top}px`
    this.triggerOptionsFn('change')
  }

  cropStart(event: MouseEvent | TouchEvent) {
    this.action = ACTION_MOVE
    if (event.type === 'mousedown') {
      const e = event as MouseEvent
      this.pointers = {
        startX1: e.pageX,
        startY1: e.pageY,
        pageX1: e.pageX,
        pageY1: e.pageY,
        originScale: this.imageData.scale
      }
    } else {
      const e = event as TouchEvent
      this.pointers = {
        startX1: e.touches[0].pageX,
        startY1: e.touches[0].pageY,
        pageX1: e.touches[0].pageX,
        pageY1: e.touches[0].pageY,
        originScale: this.imageData.scale
      }
      if (e.touches[1]) {
        this.action = ACTION_MOVE
        this.pointers.pageX2 = e.touches[1].pageX
        this.pointers.pageY2 = e.touches[1].pageY
      }
    }
    this.triggerOptionsFn('cropStart')
  }

  cropMove(event: MouseEvent | TouchEvent) {
    if (!this.action) {
      return
    }
    event.preventDefault()

    let moveEvent = {
      pageX: 0,
      pageY: 0,
    }
    if (event.type === 'mousemove') {
      const e = event as MouseEvent
      moveEvent = {
        pageX: e.pageX,
        pageY: e.pageY,
      }
    } else {
      const e = event as TouchEvent
      const event1 = e.touches[0]
      const event2 = e.touches[1]

      // 如果有event2,说明是双指缩放
      if (event2) {
        if (!this.pointers.pageX2) {
          this.pointers.pageX2 = event2.pageX
        }
        if (!this.pointers.pageY2) {
          this.pointers.pageY2 = event2.pageY
        }

        // 双指缩放比例计算
        var zoom =
          getDistance(
            {
              x: event1.pageX,
              y: event1.pageY,
            },
            {
              x: event2.pageX,
              y: event2.pageY,
            }
          ) /
          getDistance(
            {
              x: this.pointers.startX1,
              y: this.pointers.startY1,
            },
            {
              x: this.pointers.pageX2,
              y: this.pointers.pageY2,
            }
          )

        this.zoomTo(zoom * this.pointers.originScale)
        this.triggerOptionsFn('change cropMove')
        return
      }

      moveEvent = {
        pageX: event1.pageX,
        pageY: event1.pageY,
      }
    }

    const pointers = this.pointers
    let distanchX = moveEvent.pageX - (pointers.pageX1 || 0)
    let distanchY = moveEvent.pageY - (pointers.pageY1 || 0)

    const { left, top, scale } = this.imageData

    this.imageData = {
      ...this.imageData,
      left: left + distanchX,
      top: top + distanchY,
    }

    pointers.pageX1 = moveEvent.pageX
    pointers.pageY1 = moveEvent.pageY

    this.image.style.transform = `translate(${this.imageData.left}px, ${this.imageData.top}px) rotate(${this.imageData.rotate}deg) scale(${scale})`
    this.triggerOptionsFn('change cropMove')
  }

  cropUp() {
    this.pointers = {
      startX1: 0,
      startY1: 0,
      pageX1: 0,
      pageY1: 0,
      originScale: 1,
    }
    if (!this.action) {
      return
    }
    this.action = ''

    this.triggerOptionsFn('cropEnd')
  }

  wheel(event: WheelEvent) {
    const ratio = Number(this.options.wheelZoomRatio) || 0.1
    if (!this.ready) {
      return
    }

    event.preventDefault()

    // 防止滚轮太快
    if (this.wheeling) {
      return
    }

    this.wheeling = true

    setTimeout(() => {
      this.wheeling = false
    }, 50)

    const delta = event.deltaY > 0 ? 1 : -1

    let r = Number(-delta * ratio)

    if (r < 0) {
      r = 1 / (1 - r)
    } else {
      r = 1 + r
    }

    const { scale } = this.imageData
    this.zoomTo(r * scale)
  }

  // 缩放到原图的多少倍
  zoomTo(r: number) {
    const { naturalHeight, naturalRatio } = this.initialImageData
    const _height = naturalHeight * r
    const _width = naturalHeight * r * naturalRatio
    this.imageData = {
      rotate: this.imageData.rotate,
      width: _width,
      height: _height,
      scale: r,
      left: this.imageData.left - (_width - this.imageData.width) / 2,
      top: this.imageData.top - (_height - this.imageData.height) / 2 ,
    }
    this.setStyle()
  }

  // 旋转图片
  rotateTo(r: number) {
    r = r % 360
    this.imageData.rotate = r
    this.setStyle()
  }

  // 绘制真实裁剪后的图片
  getCroppedCanvas() {
    const {
      width: cropWidth,
      height: cropHeight,
      left: cropLeft,
      top: cropTop,
    } = this.cropBoxData

    const { left: imageLeft, top: imageTop, rotate, scale } = this.imageData
    // 创建裁剪框canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    // canvas.style.border = '1px solid blue'
    const width = cropWidth / scale
    const height = cropHeight / scale
    canvas.width = width
    canvas.height = height
    context.fillStyle = 'transparent'
    context.fillRect(0, 0, width, height)
    context.save()

    let tranX = (cropLeft - imageLeft) / scale
    let tranY = (cropTop - imageTop) / scale
    context.translate(-tranX, -tranY)
    context.rotate((rotate * Math.PI) / 180)

    // 绘制原图在容器中显示的样子
    context.drawImage(
      this.image,
      0,
      0,
      (width + Math.abs(tranX)) * 2,
      (height + Math.abs(tranY)) * 2,
      0,
      0,
      (width + Math.abs(tranX)) * 2,
      (height + Math.abs(tranY)) * 2
    )
    context.restore()
    return canvas
  }

  // 获取预览图片，和裁剪框一样大小
  getPreviewCanvas() {
    const { width: cropWidth, height: cropHeight } = this.cropBoxData
    const canvas1 = this.getCroppedCanvas()
    // 创建裁剪框canvas2
    const canvas2 = document.createElement('canvas')
    const context2 = canvas2.getContext('2d') as CanvasRenderingContext2D
    // canvas2.style.border = '1px solid blue'
    canvas2.width = cropWidth
    canvas2.height = cropHeight
    context2.fillStyle = 'transparent'
    context2.fillRect(0, 0, cropWidth, cropHeight)
    context2.save()
    // 绘制原图在容器中显示的样子
    context2.drawImage(canvas1, 0, 0, cropWidth, cropHeight)
    return canvas2
  }

  // 添加事件
  bind() {
    this.onWheel = this.wheel.bind(this)
    this.onCropStart = this.cropStart.bind(this)
    this.onCropMove = this.cropMove.bind(this)
    this.onCropUp = this.cropUp.bind(this)
    this.cropper.addEventListener(EVENT_WHEEL, this.onWheel, {
      passive: false,
      capture: true,
    })
    this.cropper.addEventListener(EVENT_TOUCH_START, this.onCropStart, false)
    document.addEventListener(EVENT_TOUCH_MOVE, this.onCropMove, {
      passive: false,
    })
    document.addEventListener(EVENT_TOUCH_END, this.onCropUp)
  }

  // 去除事件
  unbind() {
    this.cropper.removeEventListener(EVENT_WHEEL, this.onWheel)
    this.cropper.removeEventListener(EVENT_TOUCH_START, this.onCropStart)
    document.removeEventListener(EVENT_TOUCH_MOVE, this.onCropMove)
    document.removeEventListener(EVENT_TOUCH_END, this.onCropUp)
  }

  getImageData() {
    return this.imageData
  }
  // 去除裁剪内容
  unbuild() {
    if (!this.ready) {
      return
    }
    this.ready = false
    this.cropper?.parentNode?.removeChild(this.cropper)
  }

  // 清除上一张图片的数据
  clear() {
    this.unbuild()
    this.unbind()
  }

  // 替换图片
  replace(element: string | File) {
    this.clear()
    this.element = element
    this.init()
  }

  // 触发option事件
  triggerOptionsFn(name: any) {
    const names = name.split(' ')
    names.forEach((ele: FnNamesT) => {
      const fn = this.options[ele]
      if (fn && typeof fn === 'function') {
        fn()
      }
    })
  }
}

export default Cropper
