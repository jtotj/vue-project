<template>
    <div class="cnt" v-loading="loading">
        <h3>{{ $t('csnav.faq') }}</h3>

        <!-- <h5>1. 가입관련</h5> -->
        <ul class="faq_list">
            <li :class="{ on: ~s_document_srls.indexOf(document.document_srl) }" v-for="document in document_list">
                <em @click="toggle(document.document_srl)" class="question"><i class="ico qna_q">Q - </i>{{ document.title }}</em>
                <p class="answer" v-html="document.content" style="color: #029183"></p>
            </li>
        </ul>
        <page-navigation v-if="!loading" :total_count="page_navigation.total_count" :total_page="page_navigation.total_page" :cur_page="$route.query.page || 1" :page_count="page_navigation.page_count"></page-navigation>
    </div>
</template>

<script>
import { fetchList } from '@/api/document'
import func from '@/classes/func.inc'
import php from 'phpjs'
import PageNavigation from '@/components/PageNavigation'

export default {
    name: 'faq-cs',
    components: { PageNavigation },
    data() {
        return {
            loading: false,
            document_list: [],
            page_navigation: {},
            s_document_srls: [],
            page: 1,
            php,
            func,
        }
    },
    mounted() {
        this.loadDocumentList();
    },
    watch: {
        '$route' (to, from) {
            this.page = this.$route.query.page || 1;
            this.loadDocumentList();
        }
    },
    methods: {
        loadDocumentList() {
            this.loading = true;
            return fetchList('faq', { page: this.page }).then(({ document_list, page_navigation }) => {
                this.document_list = document_list;
                this.page_navigation = page_navigation;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        },
        toggle(document_srl) {
            var idx = this.s_document_srls.indexOf(document_srl);

            if(~idx) this.s_document_srls.splice(idx, 1);
            else this.s_document_srls.push(document_srl);
        }
    }
}
</script>
