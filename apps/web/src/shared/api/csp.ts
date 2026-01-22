import { IS_DEV } from '../constants/env'

export const permission = {
  SELF: '\'self\'',
  NONE: '\'none\'',
  UNSAFE_INLINE: '\'unsafe-inline\'',
  DATA: 'data:',
  HTTPS: 'https:',
} as const

export const strictCsp = {
  defaultSrc: [permission.SELF],
  baseUri: [permission.SELF],
  fontSrc: [permission.SELF, permission.HTTPS, permission.DATA],
  formAction: [permission.SELF],
  frameAncestors: [permission.SELF],
  imgSrc: [permission.SELF, permission.DATA, permission.HTTPS],
  objectSrc: [permission.NONE],
  scriptSrc: [permission.SELF],
  scriptSrcAttr: [permission.NONE],
  styleSrc: [permission.SELF],
  upgradeInsecureRequests: IS_DEV ? null : [],
}

export const docsCsp = {
  defaultSrc: [permission.SELF],
  scriptSrc: [permission.SELF, permission.UNSAFE_INLINE, 'https://cdn.jsdelivr.net'],
  scriptSrcElem: [permission.SELF, 'https://cdn.jsdelivr.net'],
  styleSrc: [permission.SELF, permission.UNSAFE_INLINE, 'https://cdn.jsdelivr.net'],
  styleSrcElem: [permission.SELF, permission.UNSAFE_INLINE, 'https://cdn.jsdelivr.net'],
  styleSrcAttr: [permission.UNSAFE_INLINE],
  fontSrc: [permission.SELF, permission.HTTPS, permission.DATA, 'https://cdn.jsdelivr.net'],
  imgSrc: [permission.SELF, permission.DATA, permission.HTTPS],
  connectSrc: [permission.SELF],
  workerSrc: [permission.SELF, 'blob:'],
  childSrc: [permission.SELF, 'blob:'],
  objectSrc: [permission.NONE],
  baseUri: [permission.SELF],
  formAction: [permission.SELF],
  frameAncestors: [permission.NONE],
}
