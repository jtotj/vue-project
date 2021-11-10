<template>
    <div class="cnt invest" v-loading="loading">
        <h3>{{ $t('mypage.mypromotion') }}</h3>
        <div class="table_box" style="border-radius:10px;">
            <table>
                <thead>
                    <tr>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.registration_date') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.target_account') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.withdrawal_remainder_number') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.amount_paid') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in log_list">
                        <td>{{ func.zdate(log.regdate) }}</td>
                        <td>{{ log.account_number }}</td>
                        <td>{{ php.number_format(log.remain_withdraw_allow_trade_clear_count) }}</td>
                        <td>{{ php.number_format(log.amass_margin) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { fetchLogList } from '@/api/coupon'
import func from '@/classes/func.inc'
import php from 'phpjs'
import PageNavigation from '@/components/PageNavigation'

export default {
    name: 'MyPromotion',
    components: { PageNavigation },
    data() {
        return {
            loading: false,
            log_list: [],
            page_navigation: {},
            search_params: {},
            page: 1,
            php,
            func,
        }
    },
    mounted() {
        this.loadLogList();
        this.search_params = { ...this.$route.query };
    },
    watch: {
        '$route' (to, from) {
            this.page = this.$route.query.page || 1;
            this.loadLogList();
        }
    },
    methods: {
        search() {
            this.$router.push({ query: this.search_params })
        },
        loadLogList() {
            this.loading = true;
            return fetchLogList({ ...this.$route.query }).then(({ data, page_navigation }) => {
                this.log_list = data;
                this.page_navigation = page_navigation;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
