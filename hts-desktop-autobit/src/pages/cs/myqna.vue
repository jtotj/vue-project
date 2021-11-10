<template>
    <div class="cnt" v-loading="loading">
        <h3>
            {{ $t('csnav.inquiry_details') }}
            <form @submit.prevent="search" class="board_srch">
                <input type="text" class="srch_keyword" v-model="search_params.search_keyword" :placeholder="$t('cmd_enter_search_word')">
                <button type="submit">{{ $t('search') }}</button>
            </form>
        </h3>
        <div class="table_box board" style="border-radius:10px;">
            <table>
                <colgroup><col width="*"><col width="155"><col width="130"></colgroup>
                <thead>
                    <tr>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('title') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('mypage.registration_date') }}</th>
                        <th style="color:#373737; background:#ddd;" scope="col">{{ $t('state') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="document in document_list">
                        <td class="a_l"><router-link :to="{ name: 'myqnaView', params: document }">{{ document.title }}</router-link></td>
                        <td>{{ func.zdate(document.regdate, 'Y-m-d') }}</td>
                        <td>
                            <i v-if="document.comment_count" class="label success">{{ $t('complete_response') }}</i>
                            <i v-else class="label">{{ $t('waiting_response') }}</i>
                        </td>
                    </tr>
                    <tr v-if="!document_list.length">
                        <td colspan="3"><br /><br /><br />{{ $t('csnav.msg_no_inquiry_details') }}<br /><br /><br /><br /></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <page-navigation v-if="!loading" :total_count="page_navigation.total_count" :total_page="page_navigation.total_page" :cur_page="$route.query.page || 1" :page_count="page_navigation.page_count"></page-navigation>
    </div>
</template>

<script>
import { fetchList } from '@/api/document'
import func from '@/classes/func.inc'
import php from 'phpjs'
import PageNavigation from '@/components/PageNavigation'

export default {
    name: 'myqna-cs',
    components: { PageNavigation },
    data() {
        return {
            loading: false,
            document_list: [],
            page_navigation: {},
            search_params: {},
            page: 1,
            php,
            func,
        }
    },
    mounted() {
        this.loadDocumentList();
        this.search_params = { ...this.$route.query };
    },
    watch: {
        '$route' (to, from) {
            this.page = this.$route.query.page || 1;
            this.loadDocumentList();
        }
    },
    methods: {
        search() {
            this.$router.push({ query: this.search_params })
        },
        loadDocumentList() {
            this.loading = true;

            return fetchList('contact', { ...this.$route.query, search_target: 'title_content' }).then(({ document_list, page_navigation }) => {
                this.document_list = document_list;
                this.page_navigation = page_navigation;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
