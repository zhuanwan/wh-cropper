import './css/style.less'
import Cropper from './cropper'

const filelInput = document.getElementById('filelInput') as HTMLInputElement
const linkStart = document.getElementById('linkStart') as HTMLButtonElement
const link = document.getElementById('link') as HTMLDivElement
const container = document.getElementById('container') as HTMLElement
const cropBtn = document.getElementById('crop-btn') as HTMLButtonElement
const result = document.getElementById('result') as HTMLDivElement

const cropTypeOneBtn = document.getElementById('crop-type-one') as HTMLButtonElement
const cropTypeTwoBtn = document.getElementById('crop-type-two') as HTMLButtonElement
const cropTypeThreeBtn = document.getElementById('crop-type-three') as HTMLButtonElement

const cropZoomBtn = document.getElementById('crop-zoom-number') as HTMLInputElement
const cropRotateBtn = document.getElementById('crop-rotate-number') as HTMLInputElement

const downloadImg = document.getElementById('download-img') as HTMLButtonElement



let image: string | File | undefined | null = ''
let cropper: Cropper

filelInput.onchange = function () {
  image = filelInput.files?.[0]
  if (cropper) {
    cropper.replace(image as File)
  } else {
    cropper = new Cropper(image as File, container, {})
  }
}

linkStart.onclick = function () {
  image = link.textContent

  if (cropper) {
    cropper.replace(image as string)
  } else {
    cropper = new Cropper(image as string, container, {
      aspect: 6 / 4,
      containerWidth: 350,
      containerHeight: 350,

      change: () => {
        console.log(cropper.getImageData())
        cropBtn.click()
        cropZoomBtn.value = cropper.getImageData().scale + ''
        cropRotateBtn.value = cropper.getImageData().rotate + ''
      },
    })
  }
}

cropBtn.click = function () {
  result.innerHTML = ''
  result.appendChild(cropper.getPreviewCanvas())
}

cropTypeOneBtn.onclick = function () {
  cropper.setType(1)
}

cropTypeTwoBtn.onclick = function () {
  cropper.setType(2)
}

cropTypeThreeBtn.onclick = function () {
  cropper.setType(3)
}

linkStart.click()


cropZoomBtn.onchange = function() {
  cropper.zoomTo(this.value)
}

cropRotateBtn.onchange = function() {
  cropper.rotateTo(this.value)
}

downloadImg.onclick = function() {
  const canvasElement = cropper.getCroppedCanvas()
  var imgURL = canvasElement.toDataURL('image/png');

  var dlLink = document.createElement('a');
  dlLink.download = 'test';
  dlLink.href = imgURL;
  dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');

  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}


