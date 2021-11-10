import commonLayout from 'components/CommonLayout'
import index from 'm.pages/index'
import traderoom from 'm.pages/traderoom'

export default [
    {
        path: '/',
        redirect: '/index',
        name: 'commonLayout',
        component: commonLayout,
        children: [
            {
                path: 'index',
                component: index,
                name: 'index',
            },
            {
                path: 'traderoom/:asset',
                component: require('components/TraderoomNav'),
                children: [
                    {
                        path: '',
                        component: traderoom,
                        name: 'traderoom',
                    },
                    {
                        path: 'orderbook',
                        component: require('m.pages/traderoom/orderbook.vue'),
                        name: 'orderbook',
                    },
                    {
                        path: 'chart',
                        component: require('m.pages/traderoom/chart.vue'),
                        name: 'chart',
                    },
                    {
                        path: 'trend',
                        component: require('m.pages/traderoom/orderbook.vue'),
                        name: 'trend',
                    },
                    {
                        path: 'info',
                        component: require('m.pages/traderoom/orderbook.vue'),
                        name: 'info',
                    },
                ],
            },
            {
                path: 'invest',
                component: require('@/m.components/InvestNav'),
                children: [
                    {
                        path: '',
                        component: require('m.pages/invest.vue'),
                        name: 'invest',
                    },
                    {
                        path: 'history',
                        component: require('m.pages/invest/history.vue'),
                        name: 'investHistory',
                    },
                    {
                        path: 'pending',
                        component: require('m.pages/invest/pending.vue'),
                        name: 'investPending',
                    }
                ],
            },
            {
                path: 'fund',
                component: require('m.pages/fund'),
                name: 'fund',
            },
            {
                path: 'fund/:account_srl',
                component: require('components/FundNav'),
                redirect: 'fund/:account_srl/deposit',
                children: [
                    {
                        path: 'deposit',
                        component: require('m.pages/fund/deposit.vue'),
                        name: 'deposit',
                    },
                    {
                        path: 'withdraw',
                        component: require('m.pages/fund/withdraw.vue'),
                        name: 'withdraw',
                    },
                ],
            },
            {
                path: 'notice',
                component: require('m.pages/notice'),
                name: 'notice',
            },
            {
                path: 'notice/:document_srl',
                component: require('m.pages/notice/view.vue'),
                name: 'noticeView',
            },
            {
                path: 'cs',
                name: 'cs',
                redirect: { name: 'contact' },
                component: require('m.components/CsNav'),
                children: [
                    {
                        path: 'contact',
                        name: 'contact',
                        component: require('pages/cs/contact'),
                    },
                    {
                        path: 'myqna',
                        name: 'myqna',
                        component: require('pages/cs/myqna'),
                    },
                    {
                        path: 'myqna/:document_srl',
                        name: 'myqnaView',
                        component: require('pages/cs/myqnaView'),
                    },
                    {
                        path: 'faq',
                        name: 'faq',
                        component: require('pages/cs/faq'),
                    },
                ]
            },
            {
                path: 'policy',
                name: 'policy',
                redirect: { name: 'terms' },
                component: require('m.components/PolicyNav'),
                children: [
                    {
                        path: 'terms',
                        name: 'terms',
                        component: require('pages/policy/terms'),
                    },
                    {
                        path: 'privacy',
                        name: 'privacy',
                        component: require('pages/policy/privacy'),
                    },
                    {
                        path: 'fee',
                        name: 'fee',
                        component: require('pages/cs/fee'),
                    },
                ]
            },
            {
                path: 'mypage',
                name: 'mypage',
                redirect: { name: 'myinfo' },
                component: require('m.components/MypageNav'),
                children: [
                    {
                        path: 'info',
                        name: 'myinfo',
                        props: {
                            hide_account: true,
                        },
                        component: require('pages/mypage/info'),
                        meta: { login_required: true },
                    },
                    {
                        path: 'promotion',
                        name: 'mypromotion',
                        component: require('pages/mypage/promotion'),
                        meta: { login_required: true },
                    },
                    {
                        path: 'otp',
                        name: 'myotp',
                        component: require('pages/mypage/otp'),
                        meta: { login_required: true },
                    },
                ]
            },
            {
                path: '/login',
                name: 'login',
                component: require('m.pages/login.vue'),
            },
            {
                path: '/join',
                name: 'join',
                redirect: { name: 'login' },
                component: require('m.pages/join.vue'),
            }
        ]
    }
];
