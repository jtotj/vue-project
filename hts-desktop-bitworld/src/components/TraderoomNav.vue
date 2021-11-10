<template>
    <section>
        <nav class="sub_menu">
            <ul>
                <li v-for="menu in menu_list" :class="[{ on: menu.name == $route.name }]"><router-link :to="{ name: menu.name, params: $route.params }" :data-tab="menu.data">{{ menu.title }}</router-link></li>
            </ul>
        </nav>
        <router-view></router-view>
    </section>
</template>

<script>
export default {
    data() {
        return {
            menu_list: [
                { name: 'traderoom', title: this.$t('order'), data: 'order' },
                { name: 'orderbook', title: this.$t('order_book'), data: 'order' },
                { name: 'chart', title: this.$t('chart'), data: 'chart' },
                // { name: 'trend', title: '시세', data: 'trends' },
                // { name: 'info', title: '정보', data: 'info' },
            ]
        }
    }
}
</script>
