import router from '@/router';
import store from '@/vuex/store';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

store.dispatch('getInit');
NProgress.configure({ showSpinner: false })// NProgress Configuration

router.beforeEach(async(to, from, next) => {
  try {
    NProgress.start() // start progress bar

    const is_logged_before = store.getters.is_logged;
    const logged_info = await store.dispatch('GetUserInfo');
    const _next = (...args) => {
      const [{ name }] = args;

      if(from.name === name) NProgress.done();

      next(...args);
    }

    NProgress.inc();

    // 이미 로그인 되어 있지 않은 상태였던 경우 로딩
    if(!is_logged_before) {
      await Promise.all([
        store.dispatch('getUnclosedTrades'),
        store.dispatch('getFutureBalances'),
        store.dispatch('getAccounts'),
        store.dispatch('GetOtps'),
      ])
    }

    // 로그인한 상태에서 로그인 페이지 또는 회원가입 페이지로 들어오면 메인페이로 보내기
    if(logged_info.member_srl && ['login', 'join'].indexOf(to.name) !== -1) {
      return _next({ name: 'index' });
    }

    // 로그인이 필요한 페이지에 로그인 없이 들어오면 리턴~
    if(!logged_info.member_srl && to.meta.login_required) {
      return _next({ name: 'login' });
    }

    return next();
  } catch(e) {
    console.log(e);

    NProgress.done();
    return next(false);
  }
});

router.afterEach((to, from) => {

    NProgress.done();
})
