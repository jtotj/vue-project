import axios from 'axios';
import { getLocale } from '@/utils/locale';
import _ from 'lodash';
import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
// import Toasted from 'vue-toasted';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

// Tell Vue to install the plugin.
// Vue.use(Toasted, { duration: 5000, theme: 'bubble', icon: 'info_outline', fullWidth: false, position: 'top-center', iconPack: 'material' });
Vue.use(VuejsDialog);

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = getLocale();

    return config;
  },
  (error) => {
    // Do something with request error
    Promise.reject(error);
  },
);

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  (response) => {
    const res = response.data;
    if (res.error < 0) {
      Vue.toasted.error(res.message);
      return Promise.reject(res);
      // // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // 请自行在引入 MessageBox
      //   // import { Message, MessageBox } from 'element-ui'
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload() // 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
    }
    return _.chain({})
      .extend(response.data)
      .omit('variables')
      .extend(response.data.variables)
      .value();
  },
  (error) => {
    console.log(`err${error}`); // for debug
    Vue.toasted.error(error.message);
    return Promise.reject(error);
  },
);

export default service;
