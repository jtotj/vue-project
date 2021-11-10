import layout from 'components/Layout'
import index from 'pages/index'

export default [
    {
        path: '/',
        redirect: '/index',
        name: 'commonLayout',
        props: { view_mode: 'main' },
        component: layout,
        children: [
            {
                path: 'index',
                component: index,
                name: 'index',
            },
            {
                path: 'fund',
                component: require('pages/fund'),
                name: 'fund',
            },
            {
                path: 'fund/:account_srl',
                component: require('components/FundNav'),
                redirect: 'fund/:account_srl/deposit',
                children: [
                    {
                        path: 'deposit',
                        component: require('pages/fund/deposit.vue'),
                        name: 'deposit',
                    },
                    {
                        path: 'withdraw',
                        component: require('pages/fund/withdraw.vue'),
                        name: 'withdraw',
                    },
                ],
            },
            // {
            //     path: 'notice',
            //     component: require('pages/notice'),
            //     name: 'notice',
            // },
            // {
            //     path: 'notice/:document_srl',
            //     component: require('pages/notice/view.vue'),
            //     name: 'noticeView',
            // },
        ]
    },
    {
        path: '/',
        component: require('components/Layout'),
        props: { view_mode: 'exchange' },
        children: [
            {
                path: 'balances',
                name: 'balances',
                component: require('pages/balances'),
            },
            {
                path: 'invest',
                name: 'invest',
                component: require('pages/invest'),
            },
            {
                path: 'invest/order',
                name: 'order',
                component: require('pages/order'),
            },
            // {
            //     path: 'pending',
            //     name: 'pending',
            //     component: require('pages/pending'),
            // },
            // {
            //     path: 'io',
            //     name: 'io',
            //     component: require('pages/io'),
            // }
        ],
    },
    {
        path: '/',
        component: require('components/Layout'),
        props: { view_mode: 'trade' },
        children: [
            {
                path: 'traderoom',
                name: 'traderoom',
                component: require('pages/traderoom'),
            }
        ],
    },
    {
        path: '/',
        component: require('components/Layout'),
        props: { view_mode: 'sub' },
        children: [
            {
                path: '/login',
                name: 'login',
                component: require('pages/login.vue'),
            },
            {
                path: '/policy/terms',
                name: 'terms',
                component: require('pages/policy/terms'),
            },
            {
                path: '/policy/privacy',
                name: 'privacy',
                component: require('pages/policy/privacy'),
            },
            {
                path: '/policy/trade',
                name: 'trade',
                component: require('pages/policy/trade'),
            },
            {
                path: 'cs',
                name: 'cs',
                redirect: { name: 'notice' },
                component: require('components/CsNav'),
                children: [
                    {
                        path: 'notice',
                        name: 'notice',
                        component: require('pages/cs/notice'),
                    },
                    {
                        path: 'notice/:document_srl',
                        name: 'noticeView',
                        component: require('pages/cs/noticeView'),
                    },
                    {
                        path: 'guide',
                        name: 'guide',
                        component: require('pages/cs/guide'),
                    },
                    {
                        path: 'fee',
                        name: 'fee',
                        component: require('pages/cs/fee'),
                    },
                    {
                        path: 'policy',
                        name: 'policy',
                        component: require('pages/cs/policy'),
                    },
                    {
                        path: 'contact',
                        name: 'contact',
                        component: require('pages/cs/contact'),
                        props: true,
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
                path: 'mypage',
                name: 'mypage',
                redirect: { name: 'myinfo' },
                component: require('components/MypageNav'),
                children: [
                    {
                        path: 'info',
                        name: 'myinfo',
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
                        path: 'invitee',
                        name: 'myinvitee',
                        component: require('pages/mypage/invitee'),
                        meta: { login_required: true },
                    },
                    {
                        path: 'otp',
                        name: 'myotp',
                        component: require('pages/mypage/otp'),
                        meta: { login_required: true },
                    },
                ]
            }
        ],
    },
    {
        path: '/join',
        component: require('components/Layout'),
        props: { view_mode: 'join' },
        redirect: { name: 'login' },
        children: [
            {
                path: '',
                name: 'join',
                redirect: { name: 'login' },
                component: require('pages/join'),
            },
        ]
    },
    {
        path: '/bot',
        component: require('pages/bot'),
        name: 'bot',
    },
    {
        path: '*',
        name: 'pageNotFound',
        component: require('pages/_common/NotFound.vue')
    }
];
