
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
