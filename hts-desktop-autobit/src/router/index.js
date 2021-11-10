import Vue from 'vue'
import Router from 'vue-router'
import desktopRouter from './desktop'
import mobileRouter from './mobile'
import store from '@/vuex/store';
import platform_type from '@/utils/platformType'

Vue.use(Router)

const type_routes = { desktop: desktopRouter, mobile: mobileRouter };

// 일반
// import commonLayout from 'components/CommonLayout'
// import traderoom from 'pages/traderoom'

// 공통
// import _commonPageNotFound from 'pages/_common/pageNotFound'

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/pg/cocofx/callback',
            component: require('pages/pg/CocofxCallback.vue'),
            name: 'pg-cocofx-callback',
        },
        ...type_routes[platform_type],
        {
            path: '/@:inviter_code',
            beforeEnter(to, from, next) {
                store.dispatch('setInviterCode', to.params.inviter_code);

                const { to_name } = to.query;
                const link = to_name ? router.resolve({ name: to_name }) : null;
                if (to_name && link && link.href !== '/') {
                    next({ name: to.query.to_name });
                } else {
                    next({ name: 'index' });
                }
            }
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})

export default router;
