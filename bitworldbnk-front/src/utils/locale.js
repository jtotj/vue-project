import Cookies from 'js-cookie'
import { locales } from '@locales'
import includes from 'lodash/includes'
export function getLocale() {
  if (!Cookies.get('locale')) {
    if (navigator.language === 'ja') {
      return 'ja-JP'
    } else if (navigator.language === 'ko') {
      return 'ko-KR'
    } else if (navigator.language === 'vi') {
      return 'vi-VN'
    } else if (navigator.language === 'pt') {
      return 'pt-PT'
    } else if (navigator.language === 'fr') {
      return 'fr-FR'
    } else if (navigator.language === 'en') {
      return 'en-US'
    } else if (navigator.language === 'de') {
      return 'de-DE'
    } else if (!includes(Object.keys(locales), navigator.language)) {
      return 'ko-KR'
    }
  }

  return Cookies.get('locale') || navigator.language
}
export function setLocale(locale) {
  Cookies.set('locale', locale)
}
