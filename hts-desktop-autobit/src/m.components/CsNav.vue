<template>
    <section>
        <nav class="cs_menu">
            <ul>
                <li v-for="menu in menu_list"><router-link :to="{ name: menu.name }">{{ menu.title }}</router-link></li>
            </ul>
        </nav>
        <router-view style="min-height: 200px;" :from-mobile="true"></router-view>
    </section>
</template>

<style scoped>
    section { height: auto !important; overflow-y: auto !important; }
    .cs_menu ul li { width: 33.33333333333% !important; }
</style>

<script>
export default {
    data() {
        return {
            menu_list: [
                {name: 'contact', title: this.$t('csnav.contact')},
                {name: 'myqna', title: this.$t('csnav.inquiry_details')},
                {name: 'faq', title: this.$t('csnav.faq')},
            ]
        }
    }
}
</script>
