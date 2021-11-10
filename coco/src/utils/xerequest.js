import axios from 'axios'
import http_build_query from 'locutus/php/url/http_build_query'
import { getXeLocale } from '@utils/xe-local'

const service = axios.create({
  baseURL: 'https://aboutcoin.io/',
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    const [target_module, act] = config.url.split('.')
    config.data = { ...config.data, module: target_module, act }
    config.url = 'index.php'
    config.method = 'post'

    config.headers['Accept-Language'] = getXeLocale()
    config.headers['Content-Type'] =
      config.headers['Content-Type'] || 'application/json'
    config.data = http_build_query(config.data)
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (typeof res.error === 'undefined')
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ error: -1, message: 'Invalid response' })

    if (res.error) return Promise.reject(res)

    return res
  },
  (error) => {
    let result = null
    if (error.response && error.response.data) {
      result = error.response.data
    } else {
      result = {
        error: -1,
        message: 'Unknown Error',
      }
    }
    return result
  }
)

export default service
