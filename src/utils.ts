export function createImageElement(
  file: Blob | File
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (URL) {
      let img = document.createElement('img')
      img.src = window.URL.createObjectURL(file)
      img.onload = function () {
        window.URL.revokeObjectURL(img.src)
        resolve(img)
      }
      img.onerror = function (err) {
        reject(err)
      }
    } else if (FileReader) {
      const reader = new FileReader()
      reader.onload = function () {
        let img = document.createElement('img')
        img.src = reader.result as string
        resolve(img)
      }
      reader.onerror = function (err) {
        reject(err)
      }
      reader.readAsDataURL(file)
    }
  })
}

export function loadImage(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      resolve(xhr.response)
    }
    xhr.onerror = (err) => {
      reject(err)
    }
    xhr.send()
  })
}

// 获取坐标之间的举例
export function getDistance(
  start: { x: number; y: number },
  stop: { x: number; y: number }
) {
  return Math.hypot(stop.x - start.x, stop.y - start.y)
}

export function getMaxZoomRatio(pointers: {
  [key: string]: {
    startX?: number
    startY?: number
    endX: number
    endY: number
  }
}) {
  const pointers2 = { ...pointers }
  let maxRatio = 0

  Object.keys(pointers).forEach((pointerId) => {
    const pointer = pointers[pointerId]
    delete pointers2[pointerId]

    Object.keys(pointers2).forEach((pointerId2) => {
      const pointer2 = pointers2[pointerId2]

      const x1 = Math.abs((pointer.startX || 0) - (pointer2.startX || 0))
      const y1 = Math.abs((pointer.startY || 0) - (pointer2.startY || 0))
      const x2 = Math.abs(pointer.endX - pointer2.endX)
      const y2 = Math.abs(pointer.endY - pointer2.endY)
      const z1 = Math.sqrt(x1 * x1 + y1 * y1)
      const z2 = Math.sqrt(x2 * x2 + y2 * y2)
      const ratio = (z2 - z1) / z1

      if (Math.abs(ratio) > Math.abs(maxRatio)) {
        maxRatio = ratio
      }
    })
  })

  return maxRatio
}
