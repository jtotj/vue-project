import Cookies from 'js-cookie'
import { locales } from '@/locales'
import includes from 'lodash/includes'

export function getXeLocale() {
  if (!Cookies.get('locale')) {
    if (navigator.language === 'ja') {
      return 'jp'
    } else if (navigator.language === 'pt') {
      return 'mn'
    } else if (!includes(Object.keys(locales), navigator.language)) {
      return 'ko'
    }
  }

  if (Cookies.get('locale') === 'ja-JP') {
    return 'jp'
  } else if (Cookies.get('locale') === 'pt-PT') {
    return 'mn'
  }

  return Cookies.get('locale') || navigator.language
}
