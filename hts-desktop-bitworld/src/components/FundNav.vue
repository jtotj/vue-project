<template>
    <section>
        <nav class="fund_menu">
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
                { name: 'deposit', title: this.$t('deposit') },
                { name: 'withdraw', title: this.$t('withdrawal') },
            ]
        }
    }
}
</script>
