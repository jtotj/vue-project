<template>
    <section>
        <nav class="invest_menu">
            <ul>
                <li v-for="menu in menu_list" :class="[{ on: menu.name == $route.name }]"><router-link :to="{ name: menu.name, params: $route.params }">{{ menu.title }}</router-link></li>
            </ul>
        </nav>
        <router-view></router-view>
    </section>
</template>

<style scoped>
    section { height: calc(100% - 70px) !important; overflow-y: hidden !important; }
</style>

<script>
export default {
    data() {
        return {
            menu_list: [
                {name: 'invest', title: this.$t('holding_asset')},
                {name: 'investHistory', title: this.$t('transactional_information')},
                {name: 'investPending', title: this.$t('no_execution')},
                // { name: 'trend', title: '시세', data: 'trends' },
                // { name: 'info', title: '정보', data: 'info' },
            ]
        }
    }
}
</script>
