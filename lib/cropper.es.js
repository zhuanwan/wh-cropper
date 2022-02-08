var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function createImageElement(file) {
  return new Promise((resolve, reject) => {
    if (URL) {
      let img = document.createElement("img");
      img.src = window.URL.createObjectURL(file);
      img.onload = function() {
        window.URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = function(err) {
        reject(err);
      };
    } else if (FileReader) {
      const reader = new FileReader();
      reader.onload = function() {
        let img = document.createElement("img");
        img.src = reader.result;
        resolve(img);
      };
      reader.onerror = function(err) {
        reject(err);
      };
      reader.readAsDataURL(file);
    }
  });
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = (err) => {
      reject(err);
    };
    xhr.send();
  });
}
var TEMPLATE = '<div class="cropper-container" touch-action="none"><div class="cropper-box"></div></div>';
var caculate = {
  setImageDataTypeOne: function() {
    const { naturalWidth, naturalHeight, naturalRatio } = this.initialImageData;
    const { width, height, ratio } = this.containerData;
    let scale = 1;
    if (naturalWidth > width || naturalHeight > height) {
      if (naturalRatio >= ratio) {
        scale = width / naturalWidth;
      } else {
        scale = height / naturalHeight;
      }
    }
    const imgWidth = naturalWidth * scale;
    const imgHeight = naturalHeight * scale;
    this.imageData = {
      rotate: 0,
      scale,
      width: imgWidth,
      height: imgHeight,
      left: (width - imgWidth) / 2,
      top: (height - imgHeight) / 2
    };
  },
  setCropBoxDataTypeOne: function() {
    const { width: imageWidth, height: imageHeight } = this.imageData;
    const imageRatio = imageWidth / imageHeight;
    const { width, height } = this.containerData;
    const { aspect = 1 } = this.options;
    const baseWidth = imageWidth;
    const baseHeight = imageHeight;
    let cropWidth = 0;
    let cropHeight = 0;
    if (aspect >= imageRatio) {
      cropWidth = baseWidth;
      cropHeight = baseWidth / aspect;
    } else {
      cropHeight = baseHeight;
      cropWidth = baseHeight * aspect;
    }
    this.cropBoxData = {
      width: cropWidth,
      height: cropHeight,
      ratio: cropWidth / cropHeight,
      left: (width - cropWidth) / 2,
      top: (height - cropHeight) / 2
    };
  },
  setImageDataTypeTwo: function() {
    const { naturalWidth, naturalHeight, naturalRatio } = this.initialImageData;
    const {
      width: cropWidth,
      height: cropHeight,
      ratio: cropRatio
    } = this.cropBoxData;
    const { width: containerWidth, height: containerHeight } = this.containerData;
    let scale = 1;
    let width = 0;
    let height = 0;
    if (naturalRatio > cropRatio) {
      scale = cropWidth / naturalWidth;
    } else {
      scale = cropHeight / naturalHeight;
    }
    width = naturalWidth * scale;
    height = naturalHeight * scale;
    this.imageData = {
      rotate: 0,
      width,
      height,
      scale,
      left: (containerWidth - width) / 2,
      top: (containerHeight - height) / 2
    };
  },
  setImageDataTypeThree: function() {
    const { naturalWidth, naturalHeight } = this.initialImageData;
    const { width: containerWidth, height: containerHeight } = this.containerData;
    this.imageData = {
      rotate: 0,
      width: naturalWidth,
      height: naturalHeight,
      scale: 1,
      left: (containerWidth - naturalWidth) / 2,
      top: (containerHeight - naturalHeight) / 2
    };
  }
};
var style = "";
const IS_BROWSER = typeof window !== "undefined" && typeof window.document !== "undefined";
const IS_TOUCH_DEVICE = IS_BROWSER && document.documentElement ? "ontouchstart" in document.documentElement : false;
const NAMESPACE = "cropper";
const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? "touchstart" : "mousedown";
const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? "touchmove" : "mousemove";
const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? "touchend touchcancel" : "mouseup";
const EVENT_WHEEL = "wheel";
const CONTAINER_WIDTH = 200;
const CONTAINER_HEIGHT = 100;
const DEFAULTS = {
  aspect: 1,
  containerWidth: 600,
  containerHeight: 300,
  wheelZoomRatio: 0.1
};
class Cropper {
  constructor(element, container, options) {
    __publicField(this, "element");
    __publicField(this, "options");
    __publicField(this, "image");
    __publicField(this, "initialImageData");
    __publicField(this, "ready");
    __publicField(this, "container");
    __publicField(this, "cropper");
    __publicField(this, "cropBox");
    __publicField(this, "viewBox");
    __publicField(this, "face");
    __publicField(this, "containerData");
    __publicField(this, "imageData");
    __publicField(this, "onCropStart");
    __publicField(this, "pointer");
    __publicField(this, "startMoving", false);
    __publicField(this, "onCropMove");
    __publicField(this, "onCropUp");
    __publicField(this, "cropBoxData");
    __publicField(this, "setImageDataTypeOne");
    __publicField(this, "setImageDataTypeTwo");
    __publicField(this, "setCropBoxDataTypeOne");
    __publicField(this, "setImageDataTypeThree");
    __publicField(this, "wheeling");
    __publicField(this, "onWheel");
    if (!element) {
      throw new Error("\u7B2C\u4E00\u4E2A\u53C2\u6570\u5FC5\u987B\u662F\u56FE\u7247File\u6216\u8005url");
    }
    if (!container) {
      throw new Error("\u7B2C\u4E8C\u4E2A\u53C2\u6570\u5FC5\u987B\u662F\u5BB9\u5668");
    }
    this.element = element;
    this.container = container;
    this.ready = false;
    this.wheeling = false;
    this.pointer = {
      startX: 0,
      startY: 0,
      distanchX: 0,
      distanchY: 0
    };
    this.options = __spreadValues(__spreadValues({}, DEFAULTS), options);
    const { containerWidth = 600, containerHeight = 300 } = this.options;
    if (!this.options.aspect) {
      this.options.aspect = containerWidth / containerHeight;
    }
    this.setCropBoxDataTypeOne = caculate.setCropBoxDataTypeOne.bind(this);
    this.setImageDataTypeOne = caculate.setImageDataTypeOne.bind(this);
    this.setImageDataTypeTwo = caculate.setImageDataTypeTwo.bind(this);
    this.setImageDataTypeThree = caculate.setImageDataTypeThree.bind(this);
    this.init();
  }
  init() {
    const done = (res) => {
      this.image = res;
      this.start();
    };
    if (this.element instanceof File) {
      var file = this.element;
      if (!/^image\//.test(file.type)) {
        return;
      }
      createImageElement(file).then((res) => done(res));
    } else {
      loadImage(this.element).then((blob) => {
        createImageElement(blob).then((res) => done(res));
      });
    }
  }
  start() {
    if (!this.image) {
      return;
    }
    const { options } = this;
    const { naturalWidth, naturalHeight } = this.image;
    this.initialImageData = {
      naturalWidth,
      naturalHeight,
      naturalRatio: naturalWidth / naturalHeight
    };
    const _width = options.containerWidth || CONTAINER_WIDTH;
    const _height = options.containerHeight || CONTAINER_HEIGHT;
    this.containerData = {
      width: _width,
      height: _height,
      ratio: _width / _height
    };
    this.setImageDataTypeOne();
    this.setCropBoxDataTypeOne();
    this.build();
    this.bind();
    this.ready = true;
    this.triggerOptionsFn("ready");
  }
  setType(type) {
    switch (type) {
      case 1:
        this.setImageDataTypeOne();
        this.setStyle();
        break;
      case 2:
        this.setImageDataTypeTwo();
        this.setStyle();
        break;
      case 3:
        this.setImageDataTypeThree();
        this.setStyle();
        break;
    }
  }
  build() {
    const { image, container, containerData } = this;
    container.innerHTML = TEMPLATE;
    const cropper = container.querySelector(`.${NAMESPACE}-container`);
    const cropBox = cropper == null ? void 0 : cropper.querySelector(`.${NAMESPACE}-box`);
    this.container = container;
    this.cropper = cropper;
    this.cropBox = cropBox;
    image.classList.add(`${NAMESPACE}-img`);
    cropper == null ? void 0 : cropper.appendChild(image);
    this.cropper.style.width = `${containerData.width}px`;
    this.cropper.style.height = `${containerData.height}px`;
    this.setStyle();
  }
  setStyle() {
    const { image, imageData } = this;
    image.style.transformOrigin = `left top`;
    image.style.transform = `translate(${imageData.left}px, ${imageData.top}px) rotate(${imageData.rotate}deg) scale(${imageData.scale})`;
    this.cropBox.style.width = `${this.cropBoxData.width}px`;
    this.cropBox.style.height = `${this.cropBoxData.height}px`;
    this.cropBox.style.left = `${this.cropBoxData.left}px`;
    this.cropBox.style.top = `${this.cropBoxData.top}px`;
    this.triggerOptionsFn("change");
  }
  cropStart(event) {
    this.startMoving = true;
    if (event.type === "mousedown") {
      const e = event;
      this.pointer = {
        startX: e.clientX,
        startY: e.clientY,
        distanchX: 0,
        distanchY: 0
      };
    } else {
      const e = event;
      this.pointer = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        distanchX: 0,
        distanchY: 0
      };
    }
    this.triggerOptionsFn("cropStart");
  }
  cropMove(event) {
    event.preventDefault();
    if (!this.startMoving) {
      return;
    }
    let x;
    let y;
    if (event.type === "mousemove") {
      const e = event;
      x = e.clientX;
      y = e.clientY;
    } else {
      const e = event;
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    let distanchX = x - this.pointer.startX;
    let distanchY = y - this.pointer.startY;
    const { left, top, scale } = this.imageData;
    this.imageData = __spreadProps(__spreadValues({}, this.imageData), {
      left: left + distanchX,
      top: top + distanchY
    });
    this.pointer.startX = x;
    this.pointer.startY = y;
    this.image.style.transform = `translate(${this.imageData.left}px, ${this.imageData.top}px) rotate(${this.imageData.rotate}deg) scale(${scale})`;
    this.triggerOptionsFn("change cropMove");
  }
  cropUp() {
    if (!this.startMoving) {
      return;
    }
    this.startMoving = false;
    this.triggerOptionsFn("cropEnd");
  }
  wheel(event) {
    const ratio = Number(this.options.wheelZoomRatio) || 0.1;
    if (!this.ready) {
      return;
    }
    event.preventDefault();
    if (this.wheeling) {
      return;
    }
    this.wheeling = true;
    setTimeout(() => {
      this.wheeling = false;
    }, 50);
    const delta = event.deltaY > 0 ? 1 : -1;
    let r = Number(-delta * ratio);
    if (r < 0) {
      r = 1 / (1 - r);
    } else {
      r = 1 + r;
    }
    const { scale } = this.imageData;
    this.zoomTo(r * scale);
  }
  zoomTo(r) {
    const { naturalHeight, naturalRatio } = this.initialImageData;
    const { width: containerWidth, height: containerHeight } = this.containerData;
    const _height = naturalHeight * r;
    const _width = naturalHeight * r * naturalRatio;
    this.imageData = {
      rotate: this.imageData.rotate,
      width: _width,
      height: _height,
      scale: r,
      left: (containerWidth - _width) / 2,
      top: (containerHeight - _height) / 2
    };
    this.setStyle();
  }
  rotateTo(r) {
    r = r % 360;
    this.imageData.rotate = r;
    this.setStyle();
  }
  getCroppedCanvas() {
    const {
      width: cropWidth,
      height: cropHeight,
      left: cropLeft,
      top: cropTop
    } = this.cropBoxData;
    const { left: imageLeft, top: imageTop, rotate, scale } = this.imageData;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = cropWidth / scale;
    const height = cropHeight / scale;
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "transparent";
    context.fillRect(0, 0, width, height);
    context.save();
    let tranX = (cropLeft - imageLeft) / scale;
    let tranY = (cropTop - imageTop) / scale;
    context.translate(-tranX, -tranY);
    context.rotate(rotate * Math.PI / 180);
    context.drawImage(this.image, 0, 0, (width + Math.abs(tranX)) * 2, (height + Math.abs(tranY)) * 2, 0, 0, (width + Math.abs(tranX)) * 2, (height + Math.abs(tranY)) * 2);
    context.restore();
    return canvas;
  }
  getPreviewCanvas() {
    const { width: cropWidth, height: cropHeight } = this.cropBoxData;
    const canvas1 = this.getCroppedCanvas();
    const canvas2 = document.createElement("canvas");
    const context2 = canvas2.getContext("2d");
    canvas2.width = cropWidth;
    canvas2.height = cropHeight;
    context2.fillStyle = "transparent";
    context2.fillRect(0, 0, cropWidth, cropHeight);
    context2.save();
    context2.drawImage(canvas1, 0, 0, cropWidth, cropHeight);
    return canvas2;
  }
  bind() {
    this.onWheel = this.wheel.bind(this);
    this.onCropStart = this.cropStart.bind(this);
    this.onCropMove = this.cropMove.bind(this);
    this.onCropUp = this.cropUp.bind(this);
    this.cropper.addEventListener(EVENT_WHEEL, this.onWheel, {
      passive: false,
      capture: true
    });
    this.cropper.addEventListener(EVENT_TOUCH_START, this.onCropStart, false);
    document.addEventListener(EVENT_TOUCH_MOVE, this.onCropMove, {
      passive: false
    });
    document.addEventListener(EVENT_TOUCH_END, this.onCropUp);
  }
  unbind() {
    this.cropper.removeEventListener(EVENT_WHEEL, this.onWheel);
    this.cropper.removeEventListener(EVENT_TOUCH_START, this.onCropStart);
    document.removeEventListener(EVENT_TOUCH_MOVE, this.onCropMove);
    document.removeEventListener(EVENT_TOUCH_END, this.onCropUp);
  }
  getImageData() {
    return this.imageData;
  }
  unbuild() {
    var _a, _b;
    if (!this.ready) {
      return;
    }
    this.ready = false;
    (_b = (_a = this.cropper) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(this.cropper);
  }
  clear() {
    this.unbuild();
    this.unbind();
  }
  replace(element) {
    this.clear();
    this.element = element;
    this.init();
  }
  triggerOptionsFn(name) {
    const names = name.split(" ");
    names.forEach((ele) => {
      const fn = this.options[ele];
      if (fn && typeof fn === "function") {
        fn();
      }
    });
  }
}
export { Cropper as default };
