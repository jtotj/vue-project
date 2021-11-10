<template>
    <div class="clearfix">
        <local-nav :items="items"></local-nav>
        <router-view></router-view>
    </div>
</template>
<script>
import func from 'classes/func.inc';
import _ from 'lodash'
import LocalNav from 'components/admin/LocalNav'
import { mapState } from 'vuex'
export default {
    name: 'ProfileNav',
    components: { LocalNav },
    data() {
        return { func }
    },
    computed: {
        items() {
            var vm = this;
            var items = [
                { to: { name: 'profile' }, title: 'this.$t('profile')' },
                { to: { name: 'profileTrader' }, title: 'this.$t('profile_trader')' },
                { to: { name: 'profileAffiliate' }, title: 'this.$t('profile_affiliate')' },
            ];

            return _.map(items, function(item) {
                return _.extend({}, item, { selected: vm.$route.name === item.to.name });
            })
        },
        ...mapState({
            logged_info: state => state.auth.logged_info
        })
    }
}
</script>
