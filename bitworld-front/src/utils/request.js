import axios from 'axios'
import { getToken, hasToken } from '@utils/auth'
import _ from 'lodash'
import { getLocale } from '@utils/locale'
import Cookies from 'js-cookie'

const identification_code = Cookies.get('identification_code')
const service = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    const token = getToken()
    config.headers['Accept-Language'] = getLocale()

    if (identification_code) {
      config.headers['x-brokerage-identification-code'] = identification_code
    }

    if (hasToken()) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    return _.chain({})
      .extend(res)
      .omit('variables')
      .extend(res.variables)
      .value()
  },
  (error) => {
    let result = null
    if (error.response && error.response.data) {
      result = _.chain({})
        .extend(error.response.data)
        .omit('variables')
        .extend(error.response.data.variables)
        .value()
    } else {
      result = {
        error: -1,
        message: error.message,
        httpStatusCode: error.response ? error.respone.status : null,
      }
    }
    return Promise.reject(result)
  }
)

export default service
