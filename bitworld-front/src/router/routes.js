import store from '@state/store'
import layout from '@layouts/main'
import b2cLayout from '@layouts/b2c-main'
import kioskLayout from '@layouts/kiosk-layout'
import kioskReLayout from '@layouts/kiosk-re-layout'

const emptyComponent = {
  render(h) {
    return h('router-view')
  },
}

export default [
  {
    path: '/',
    redirect: () => {
      if (
        ['cocobnk.com', 'www.cocobnk.com'].indexOf(
          window.location.host.toLowerCase()
        ) !== -1
      ) {
        return '/bank'
      }

      return '/home'
    },
    component: layout,

    children: [
      {
        path: 'home',
        name: 'home',
        component: () => lazyLoadView(import('@views/new-home')),
      },
      {
        path: 'create-ads/:offer_type/:deal_seq?',
        name: 'create-ads',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/create-ads')),
      },
      {
        path: 'oldhome',
        name: 'oldhome',
        component: () => lazyLoadView(import('@views/home')),
      },
      {
        path: 'autologout',
        name: 'auto-logout',
        component: () => lazyLoadView(import('@views/auto-logout')),
      },
    ],
  },
  {
    path: '/b2c',
    component: b2cLayout,
    redirect: {
      name: 'b2c-main',
    },
    children: [
      {
        name: 'b2c-main',
        path: 'main',
        component: () => lazyLoadView(import('@views/b2c/b2c-exchange')),
      },
      {
        path: 'exchange',
        name: 'exchange',

        component: () => lazyLoadView(import('@views/b2c/b2c-exchange')),
      },
      {
        path: 'balance',
        name: 'balance',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/b2c/b2c-balance')),
      },
      {
        path: 'm/exchange-order',
        name: 'exchange-order',
        component: () => lazyLoadView(import('@views/b2c/b2c-m-order')),
      },
      {
        path: 'm/exchange-quote',
        name: 'exchange-quote',
        component: () => lazyLoadView(import('@views/b2c/b2c-m-quote')),
      },
      {
        path: 'm/exchange-chart',
        name: 'exchange-chart',
        component: () => lazyLoadView(import('@views/b2c/b2c-m-chart')),
      },
      {
        path: 'm/exchange-price',
        name: 'exchange-price',
        component: () => lazyLoadView(import('@views/b2c/b2c-m-price')),
      },
      {
        path: 'm/exchange-order-detail',
        name: 'exchange-order-detail',
        component: () => lazyLoadView(import('@views/b2c/b2c-m-order-detail')),
      },
      {
        path: 'balance/transfer/list',
        name: 'public-balance-transfer-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/b2c/public-balance-transfer-list')),
      },
      {
        path: 'trade/list',
        name: 'public-trade-list',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/b2c/public-trade-list')),
      },
      {
        path: 'myprofile',
        name: 'b2c-myprofile',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/my-profile')),
      },
      {
        path: 'kyc/:type_seq',
        name: 'b2c-kyc',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification')),
      },
      {
        path: 'kyc-list',
        name: 'b2c-kyc-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification-list')),
      },
      {
        path: 'kyc-detail',
        name: 'b2c-kyc-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification-detail')),
      },
      {
        path: 'mail-verification',
        name: 'b2c-mail-verification',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/mail-verification')),
      },
      {
        path: 'kyc-withdraw-address',
        name: 'b2c-kyc-withdraw-address',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-address')),
      },
      {
        path: 'kyc-withdraw-address-list',
        name: 'b2c-kyc-withdraw-address-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-address-list')),
      },
      {
        path: 'kyc-withdraw-detail/:seq',
        name: 'b2c-kyc-withdraw-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-detail')),
      },
      {
        path: 'otp',
        name: 'b2c-otp',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/otp')),
      },
      {
        path: 'security',
        name: 'b2c-security',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/security')),
      },
    ],
  },
  {
    path: '/dashboard',
    component: layout,
    props: {
      view_mode: 'dashboard',
    },
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/loggedIn']) {
        next()
      } else {
        next({
          name: 'login-me',
        })
      }
    },
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: 'private/deal',
        name: 'privateDeal',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/trade/private-deal-list')),
      },
      {
        path: 'cancelled',
        name: 'cancelled',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/trade/cancel-trades')),
      },
      {
        path: 'private/deal/:deal_seq/application',
        name: 'applicationSeq',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/trade/application-seq')),
      },
      {
        path: 'private/application',
        name: 'privateApplication',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/dashboard/trade/private-application-list')
          ),
      },
      {
        path: 'private/application/:seq',
        name: 'private-app-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/trade/private-app-detail')),
      },
      {
        path: 'deposit',
        name: 'Deposit',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/order/deposit-list')),
      },
      {
        path: 'deposit/detail',
        name: 'Deposit-Detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/order/deposit-detail')),
      },
      {
        path: 'withdraw',
        name: 'Withdraw',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/order/withdraw-list')),
      },
      {
        path: 'withdraw/detail',
        name: 'Withdraw-Detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/order/withdraw-detail')),
      },
      {
        path: 'wallet',
        name: 'wallet',
        meta: {
          authRequired: true,
        },
        props: true,
        component: () => lazyLoadView(import('@views/dashboard/wallet')),
      },
      {
        path: 'transfer-list',
        name: 'transfer-list',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/dashboard/transfer-list')),
      },
      {
        path: 'transfer-detail',
        name: 'transfer-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/transfer-detail')),
      },
      {
        path: 'account/transfer',
        name: 'account-transfer',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/account-transfer')),
      },
      {
        path: 'account/transfer/list',
        name: 'account-transfer-list',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/account-transfer-list')),
      },
      {
        path: 'account/transfer/:transfer_seq',
        name: 'account-transfer-detail',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/account-transfer-detail')),
      },
    ],
  },
  {
    path: '/mypage',
    component: layout,
    props: {
      view_mode: 'mypage',
    },
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/loggedIn']) {
        next()
      } else {
        next({
          name: 'login-me',
        })
      }
    },
    children: [
      {
        path: 'myprofile',
        name: 'myprofile',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/my-profile')),
      },
      {
        path: 'xplogin',
        name: 'xplogin',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/xp-login')),
      },
      {
        path: 'kyc/:type_seq',
        name: 'kyc',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification')),
      },
      {
        path: 'kyc-list',
        name: 'kyc-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification-list')),
      },
      {
        path: 'kyc-detail',
        name: 'kyc-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-certification-detail')),
      },
      {
        path: 'mail-verification',
        name: 'mail-verification',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/mail-verification')),
      },
      {
        path: 'kyc-withdraw-address',
        name: 'kyc-withdraw-address',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-address')),
      },
      {
        path: 'kyc-withdraw-address-list',
        name: 'kyc-withdraw-address-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-address-list')),
      },
      {
        path: 'kyc-withdraw-detail/:seq',
        name: 'kyc-withdraw-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/kyc/kyc-withdraw-detail')),
      },
      {
        path: 'otp',
        name: 'otp',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/otp')),
      },
      {
        path: 'security',
        name: 'security',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/security')),
      },
    ],
  },
  {
    path: '/payment',
    redirect: '/payment/payment-main',
    component: emptyComponent,
    children: [
      {
        path: 'payment-main',
        name: 'payment-main',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/pay/payment/payment-main')),
      },
    ],
  },
  {
    path: '/',
    component: emptyComponent,
    children: [
      {
        path: '/login-me',
        name: 'login-me',
        component: () => lazyLoadView(import('@views/login-me')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({
                name: 'home',
              })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: '/register',
        name: 'register',
        component: () => lazyLoadView(import('@views/register')),
      },
      {
        path: '/find',
        name: 'account-find',
        component: () => lazyLoadView(import('@views/account-find')),
      },
      {
        path: '/oauth2/authorize',
        name: 'oauth2-authorize',
        component: () => lazyLoadView(import('@views/oauth2-authorize')),
        meta: {
          authRequired: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => lazyLoadView(import('@views/login')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({
                name: 'home',
              })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: 'market/direct',
        name: 'direct-market',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/direct-market')),
      },
      {
        path: 'policy/:type',
        name: 'policy',
        component: () => lazyLoadView(import('@views/policy')),
      },

      {
        path: '/client-manage',
        name: 'client-manage',
        component: () => lazyLoadView(import('@views/client-manage')),
      },
      {
        path: '/client-modify',
        name: 'client-modify',
        component: () => lazyLoadView(import('@views/client-modify')),
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => lazyLoadView(import('@views/profile')),
        meta: {
          authRequired: true,
        },
        props: (route) => ({
          user: store.state.auth.currentUser || {},
        }),
      },
      {
        path: '/profile/:username',
        name: 'username-profile',
        component: () => lazyLoadView(import('@views/profile')),
        meta: {
          authRequired: true,
          beforeResolve(routeTo, routeFrom, next) {
            store
              // Try to fetch the user's information by their username
              .dispatch('users/fetchUser', {
                username: routeTo.params.username,
              })
              .then((user) => {
                // Add the user to the route params, so that it can
                // be provided as a prop for the view component below.
                routeTo.params.user = user
                // Continue to the route.
                next()
              })
              .catch(() => {
                // If a user with the provided username could not be
                // found, redirect to the 404 page.
                next({
                  name: '404',
                  params: {
                    resource: 'User',
                  },
                })
              })
          },
        },
        // Set the user from the route params, once it's set in the
        // beforeResolve route guard.
        props: (route) => ({
          user: route.params.user,
        }),
      },
      {
        path: '/logout',
        name: 'logout',
        meta: {
          authRequired: true,
          beforeResolve(routeTo, routeFrom, next) {
            store.dispatch('auth/logOut')
            const authRequiredOnPreviousRoute = routeFrom.matched.some(
              (route) => route.meta.authRequired
            )
            // Navigate back to previous page, or home as a fallback
            next(
              authRequiredOnPreviousRoute
                ? {
                    name: 'home',
                  }
                : {
                    ...routeFrom,
                  }
            )
          },
        },
      },
      {
        path: '/pg-xptx',
        name: 'pg-xptx',
        component: () => lazyLoadView(import('@views/pg-xptx')),
        meta: {
          authRequired: true,
        },
      },
    ],
  },
  {
    path: '/bank',
    beforeEnter: () => {
      window.location.href = 'https://cocobnk.com'
    },
  },
  {
    path: '/kiosk',
    component: kioskLayout,
    redirect: {
      name: 'kiosk-home',
    },
    children: [
      {
        name: 'kiosk-home',
        path: 'kiosk-home',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-home')),
      },
      {
        name: 'kiosk-bank',
        path: 'kiosk-bank',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-bank')),
      },
      {
        name: 'kiosk-store',
        path: 'kiosk-store',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-store')),
      },
      {
        name: 'kiosk-payment-type',
        path: 'kiosk-payment-type',
        component: () =>
          lazyLoadView(import('@views/kiosk/kiosk-payment-type')),
      },
      {
        name: 'kiosk-bank-use',
        path: 'kiosk-bank-use',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-bank-use')),
      },
      {
        name: 'kiosk-bank-alone',
        path: 'kiosk-bank-alone',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-bank-alone')),
      },
      {
        name: 'kiosk-payment',
        path: 'kiosk-payment',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-payment')),
      },
      {
        name: 'kiosk-loading',
        path: 'kiosk-loading',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-loading')),
      },
      {
        name: 'kiosk-refund',
        path: 'kiosk-refund',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-refund')),
      },
    ],
  },
  {
    path: '/kiosk-re',
    component: kioskReLayout,
    redirect: {
      name: 'kiosk-re-home',
    },
    children: [
      {
        name: 'kiosk-re-home',
        path: 'kiosk-re-home',
        component: () =>
          lazyLoadView(import('@views/kiosk-renewal/kiosk-re-home')),
      },
      {
        name: 'kiosk-re-bank',
        path: 'kiosk-re-bank',
        component: () =>
          lazyLoadView(import('@views/kiosk-renewal/kiosk-re-bank')),
      },
      {
        name: 'kiosk-re-deal-detail',
        path: 'kiosk-re-deal-detail',
        component: () =>
          lazyLoadView(import('@views/kiosk-renewal/kiosk-re-deal-detail')),
      },
      {
        name: 'kiosk-re-new-account',
        path: 'kiosk-re-new-account/:asset_code',
        component: () =>
          lazyLoadView(import('@views/kiosk-renewal/kiosk-re-new-account')),
      },
      {
        name: 'kiosk-re-charge',
        path: 'kiosk-re-charge/:asset_code',
        component: () =>
          lazyLoadView(import('@views/kiosk-renewal/kiosk-re-charge')),
      },
      {
        name: 'kiosk-re-payment',
        path: 'kiosk-re-payment',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-payment')),
      },
      {
        name: 'kiosk-re-refund',
        path: 'kiosk-re-refund',
        component: () => lazyLoadView(import('@views/kiosk/kiosk-refund')),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: require('@views/_404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('@views/_loading').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('@views/_timeout').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}
