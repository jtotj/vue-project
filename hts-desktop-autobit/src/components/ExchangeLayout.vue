<template>
    <div class="exhange">
        <TopNotice></TopNotice>
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </div>
</template>

<script>
import 'assets/css/simple-line-icons/simple-line-icons.css'
import 'assets/css/font-awesome/css/font-awesome.css'
import 'assets/css/xeicon/xeicon.css'
import 'assets/css/fonts/NanumSquare/nanumsquare.css'
import 'assets/css/style_global.css'
import 'assets/css/style_common.css'
import 'assets/css/style_pc.css'

import TopNotice from './TopNotice.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
export default {
    name: 'ExchangeLayout',
    components: { TopNotice, Header, Footer },
}
</script>
