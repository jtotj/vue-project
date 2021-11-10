import Cookies from 'js-cookie'

const token_key = 'EXI-AUTH-TOKEN'

export function getToken() {
  return Cookies.get(token_key)
}

export function setToken(token) {
  return Cookies.set(token_key, token)
}

export function removeToken() {
  return Cookies.remove(token_key)
}

export function hasToken() {
  return !!getToken()
}
