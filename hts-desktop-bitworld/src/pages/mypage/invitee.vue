<template>
    <div class="cnt invest" v-loading="loading">
        <h3>{{ $t('mypage.myinvitee') }}</h3>
        <div class="table_box" style="border-radius:10px;">
            <table>
                <thead>
                    <tr>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.mynumber') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.myid') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.transaction_number') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.deposit_approved_amount') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.join') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.final_deporsit_request_date') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="invitee in invitee_list">
                        <td>{{ php.number_format(invitee._no) }}</td>
                        <td>{{ invitee.user_id }}</td>
                        <td>{{ php.number_format(invitee.trade_count) }}</td>
                        <td>{{ php.number_format(invitee.total_deposit) }}</td>
                        <td>{{ func.zdate(invitee.regdate) }}</td>
                        <td>{{ func.zdate(invitee.last_deposit) }}</td>
                    </tr>
                    <tr v-if="!invitee_list.length">
                        <td colspan="6">{{ $t('mypage.msg_no_invitee') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page-navigation v-if="!loading" :total_count="page_navigation.total_count" :total_page="page_navigation.total_page" :cur_page="$route.query.page || 1" :page_count="page_navigation.page_count"></page-navigation>
    </div>
</template>

<script>
import { fetchInviteeList } from '@/api/member'
import func from '@/classes/func.inc'
import php from 'phpjs'
import PageNavigation from '@/components/PageNavigation'

export default {
    name: 'MyPromotion',
    components: { PageNavigation },
    data() {
        return {
            loading: false,
            invitee_list: [],
            page_navigation: {},
            search_params: {},
            page: 1,
            php,
            func,
        }
    },
    mounted() {
        this.loadInviteeList();
        this.search_params = { ...this.$route.query };
    },
    watch: {
        '$route' (to, from) {
            this.page = this.$route.query.page || 1;
            this.loadInviteeList();
        }
    },
    methods: {
        search() {
            this.$router.push({ query: this.search_params })
        },
        loadInviteeList() {
            this.loading = true;
            return fetchInviteeList({ ...this.$route.query }).then(({ data, page_navigation }) => {
                this.invitee_list = data;
                this.page_navigation = page_navigation;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
