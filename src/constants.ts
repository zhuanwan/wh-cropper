export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const IS_TOUCH_DEVICE = IS_BROWSER && document.documentElement ? 'ontouchstart' in document.documentElement : false;
export const NAMESPACE = 'cropper';

// Actions
export const ACTION_MOVE = 'move';
export const ACTION_ZOOM = 'zoom';

// Classes
export const CLASS_CROP = `${NAMESPACE}-crop`;
export const CLASS_DISABLED = `${NAMESPACE}-disabled`;
export const CLASS_HIDDEN = `${NAMESPACE}-hidden`;
export const CLASS_HIDE = `${NAMESPACE}-hide`;
export const CLASS_INVISIBLE = `${NAMESPACE}-invisible`;
export const CLASS_MODAL = `${NAMESPACE}-modal`;
export const CLASS_MOVE = `${NAMESPACE}-move`;


// Events
export const EVENT_CROP = 'crop';
export const EVENT_CROP_END = 'cropend';
export const EVENT_CROP_MOVE = 'cropmove';
export const EVENT_CROP_START = 'cropstart';
export const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
export const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
export const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend' : 'mouseup';
export const EVENT_READY = 'ready';
export const EVENT_WHEEL = 'wheel';
export const EVENT_ZOOM = 'zoom';


export const CONTAINER_WIDTH = 200;
export const CONTAINER_HEIGHT = 100;
