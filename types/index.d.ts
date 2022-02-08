

export type FnNamesT = 'change' | 'ready' | 'cropStart' | 'cropMove' | 'cropEnd'
export type OptionsT = {
  aspect?: number // 长宽比
  containerWidth?: number // 容器width
  containerHeight?: number // 容器高
  wheelZoomRatio?: number // 滚轮缩放
  change?: () => void
  ready?: () => void
  cropStart?: () => void
  cropMove?: () => void
  cropEnd?: () => void
}

