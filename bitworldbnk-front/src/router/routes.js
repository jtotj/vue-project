import store from '@state/store'
import Layout from '@layouts/main'

const emptyComponent = {
  render(h) {
    return h('router-view')
  },
}

export default [
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    children: [
      {
        name: 'home',
        path: 'home',
        component: () => lazyLoadView(import('@views/home')),
      },
      {
        path: '/xplogin',
        name: 'xplogin',
        component: () => lazyLoadView(import('@views/xplogin')),
        meta: {
          authRequired: true,
        },
      },
      {
        path: '/autologout',
        name: 'auto-logout',
        component: () => lazyLoadView(import('@views/auto-logout')),
      },
      {
        name: 'ccf-intro',
        path: 'ccf-intro',
        component: () => lazyLoadView(import('@views/ccf-intro')),
      },
      {
        path: 'wallet',
        name: 'wallet',
        meta: {
          authRequired: true,
        },
        props: true,
        component: () => lazyLoadView(import('@views/wallet')),
      },
      {
        path: 'dormancy-account',
        name: 'dormancy-account',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/dormancy-account-list')),
      },
      {
        path: 'wallet-reference',
        name: 'wallet-reference',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/wallet-reference')),
      },
      {
        path: 'pg-xptx',
        name: 'pg-xptx',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/pg-xptx')),
      },
      // {
      //   path: 'remittance-transfer',
      //   name: 'remittance-transfer',
      //   meta: {
      //     authRequired: true,
      //   },
      //   component: () => lazyLoadView(import('@views/remittance-transfer')),
      // },
      {
        path: 'svings-account',
        name: 'svings-account',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/svings-account')),
      },
      {
        path: 'term-deposit',
        name: 'term-deposit',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/term-deposit')),
      },
      {
        path: 'svings-term-list',
        name: 'svings-term-list',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/svings-term-list')),
      },
      {
        path: 'deposit',
        name: 'deposit',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/deposit-list')),
      },
      {
        path: 'deposit/detail',
        name: 'deposit-detail',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/deposit-detail')),
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/withdraw-list')),
      },
      {
        path: 'withdraw/detail',
        name: 'withdraw-detail',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/withdraw-detail')),
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
        path: '/policy',
        name: 'policy',
        component: () => lazyLoadView(import('@views/new-policy')),
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
    ],
  },
  {
    path: '/mypage',
    component: Layout,
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
        path: 'affiliate-log',
        name: 'affiliate-log',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/affiliate-log')),
      },
      {
        path: 'affiliate-balance',
        name: 'affiliate-balance',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/mypage/affiliate-balance')),
      },
      {
        path: 'affiliate-adjust',
        name: 'affiliate-adjust',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/affiliate-adjust')),
      },
      {
        path: 'invite-relation',
        name: 'invite-relation',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/mypage/invite-relation')),
      },
    ],
  },
  {
    path: '/exchange',
    component: Layout,
    children: [
      {
        path: 'direct-exchange',
        name: 'direct-exchange',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/exchange/direct-exchange')),
      },
    ],
  },
  {
    path: '/lookup',
    component: Layout,
    children: [
      {
        name: 'money',
        path: 'money',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/lookup/money')),
      },
      {
        name: 'exchange-success',
        path: 'exchange-success',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/lookup/exchange-success')),
      },
      {
        path: 'transfer-list',
        name: 'transfer-list',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/lookup/transfer-list')),
      },
      {
        path: 'transfer-detail',
        name: 'transfer-detail',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/lookup/transfer-detail')),
      },
      {
        path: 'account-balance',
        name: 'account-balance',
        meta: {
          authRequired: true,
        },
        props: true,
        component: () =>
          lazyLoadView(import('@views/lookup/account-balance-log')),
      },
    ],
  },
  {
    path: '/transfer',
    component: Layout,
    children: [
      {
        path: 'account-transfer',
        name: 'account-transfer',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/transfer/account-transfer')),
      },
      {
        path: 'account-transfer/:transfer_seq',
        name: 'account-transfer-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/transfer/account-transfer-detail')),
      },
      {
        path: 'account-transfer-list',
        name: 'account-transfer-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/transfer/account-transfer-list')),
      },
    ],
  },
  {
    path: '/new-account',
    component: Layout,
    children: [
      {
        path: 'create-address',
        name: 'create-address',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/new-account/create-account-address')),
      },
    ],
  },
  {
    path: '/certification-management',
    component: Layout,
    children: [
      {
        path: 'auth-management',
        name: 'auth-management',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/security-auth-management')
          ),
      },
      {
        path: 'kyc/:type_seq',
        name: 'kyc',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-certification')
          ),
      },
      {
        path: 'kyc-list',
        name: 'kyc-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-certification-list')
          ),
      },
      {
        path: 'kyc-detail',
        name: 'kyc-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-certification-detail')
          ),
      },
      {
        path: 'mail-verification',
        name: 'mail-verification',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/mail-verification')
          ),
      },
      {
        path: 'kyc-withdraw-address',
        name: 'kyc-withdraw-address',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-withdraw-address')
          ),
      },
      {
        path: 'kyc-withdraw-address-list',
        name: 'kyc-withdraw-address-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-withdraw-address-list')
          ),
      },
      {
        path: 'kyc-withdraw-detail/:seq',
        name: 'kyc-withdraw-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(
            import('@views/certification-management/kyc-withdraw-detail')
          ),
      },
      {
        path: 'otp',
        name: 'otp',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/certification-management/otp')),
      },
      {
        path: 'security',
        name: 'security',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/certification-management/security')),
      },
    ],
  },
  {
    path: '/clap',
    component: Layout,
    redirect: 'clap-intro',
    children: [
      {
        name: 'clap-intro',
        path: 'clap-intro',
        component: () => lazyLoadView(import('@views/clap/clap-intro')),
      },
      {
        name: 'clap-reset',
        path: 'clap-reset',
        component: () => lazyLoadView(import('@views/clap/clap-reset')),
      },
      {
        name: 'ledger-live-intro',
        path: 'ledger-live-intro',
        component: () => lazyLoadView(import('@views/clap/ledger-live-intro')),
      },
      {
        name: 'coinapp-link',
        path: 'coinapp-link',
        component: () => lazyLoadView(import('@views/clap/coinapp-link')),
      },
      {
        name: 'clap-detail',
        path: 'clap-detail',
        component: () => lazyLoadView(import('@views/clap/clap-detail')),
      },
    ],
  },
  {
    path: '/company',
    component: Layout,
    children: [
      {
        name: 'shop',
        path: 'shop',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/company/shop')),
      },
      {
        name: 'merchant-create',
        path: 'merchant-create',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/company/merchant-create')),
      },
      {
        name: 'merchant-update',
        path: 'merchant-update/:merchant_seq',
        component: () => lazyLoadView(import('@views/company/merchant-create')),
      },
      {
        name: 'merchant-detail',
        path: 'merchant-detail/:merchant_seq',
        component: () =>
          lazyLoadView(import('@views/company/merchant-list-detail')),
      },
      {
        name: 'merchant-account-list',
        path: 'merchant-account-list/:merchant_seq',
        component: () =>
          lazyLoadView(import('@views/company/merchant-account-list')),
      },
      {
        name: 'merchant-account-all-list',
        path: 'merchant-account-all-list',
        component: () =>
          lazyLoadView(import('@views/company/merchant-account-all-list')),
      },
      {
        name: 'transaction-list',
        path: 'transaction-list/:merchant_seq',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/company/merchant-transaction-list')),
      },
      {
        name: 'merchant-transaction-list',
        path: 'merchant-transaction-list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/company/merchant-transaction-list')),
      },
      {
        name: 'transaction-detail',
        path: 'transaction-detail',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/company/transaction-detail')),
      },
    ],
  },
  {
    path: '/service-center',
    component: Layout,
    children: [
      {
        name: 'service-center-home',
        path: 'service-center/home',
        component: () =>
          lazyLoadView(import('@views/service-center/service-center-home')),
      },
      {
        name: 'one-inquiry',
        path: 'service-center/one-inquiry',
        component: () =>
          lazyLoadView(import('@views/service-center/one-inquiry')),
      },
      {
        name: 'contact-history',
        path: 'service-center/contact-history',
        component: () =>
          lazyLoadView(import('@views/service-center/contact-history')),
      },
      {
        name: 'contact-detail',
        path: 'service-center/contact-detail',
        component: () =>
          lazyLoadView(import('@views/service-center/contact-detail')),
      },
      {
        name: 'contact-notice',
        path: 'service-center/contact-notice',
        component: () =>
          lazyLoadView(import('@views/service-center/contact-notice')),
      },
      {
        name: 'faq',
        path: 'service-center/faq',
        component: () => lazyLoadView(import('@views/service-center/faq')),
      },
    ],
  },
  {
    path: '/payment',
    redirect: '/payment-main',
    component: emptyComponent,
    children: [
      {
        path: 'payment-main',
        name: 'payment-main',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/payment/payment-main')),
      },
      {
        path: 'payment-login',
        name: 'payment-login',
        component: () => lazyLoadView(import('@views/payment/payment-login')),
      },
      {
        path: 'payment-guest',
        name: 'payment-guest',
        component: () => lazyLoadView(import('@views/payment/payment-guest')),
      },
    ],
  },
  {
    path: '/dashboard',
    component: Layout,
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
        name: 'dashboard',
        path: 'dashboard',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/dashboard')),
      },
      {
        path: 'private/deal',
        name: 'private-deal',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/private-deal-list')),
      },
      {
        path: 'private/application',
        name: 'private-application',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/private-application-list')),
      },
      {
        path: 'private/:deal_seq/application',
        name: 'applicationSeq',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/dashboard/application-seq')),
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
    path: '/guide',
    component: Layout,
    children: [
      {
        name: 'guide-cocobnk-account',
        path: 'guide-cocobnk-account',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/guide/guide-cocobnk-account')),
      },
    ],
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        name: 'product-subscription',
        path: 'subscription',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/product/product-subscription')),
      },
      {
        name: 'product-subscription-list',
        path: 'subscription/list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/product/product-subscription-list')),
      },
      {
        name: 'product-return-list',
        path: 'return/list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/product/product-return-list')),
      },
      {
        name: 'product-dividend-list',
        path: 'dividend/list',
        meta: {
          authRequired: true,
        },
        component: () =>
          lazyLoadView(import('@views/product/product-dividend-list')),
      },
      {
        name: 'product-search',
        path: 'search',
        component: () => lazyLoadView(import('@views/product/product-search')),
      },
      {
        name: 'fund-info',
        path: 'fund-info',
        meta: {
          authRequired: true,
        },
        component: () => lazyLoadView(import('@views/fund-info')),
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
