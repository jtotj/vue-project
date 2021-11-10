<template>
    <section>
        <div class="notice_list">
            <ul>
                <li v-for="document in document_list">
                    <router-link :to="{ name: 'noticeView', params: { document_srl: document.document_srl } }">
                        <strong class="tit">{{ document.title }}</strong>
                        <p class="date">{{ func.zdate(document.regdate) }}</p>
                    </router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { fetchList } from '@/api/document'
import func from 'classes/func.inc';

export default {
    name: 'notice',
    data() {
        return {
            document_list: [],
            func,
        }
    },
    created() {
        this.loadDocumentList();
    },
    methods: {
        loadDocumentList() {
            this.loading = true;
            return fetchList('notice', { ...this.$route.query, search_target: 'title_content' }).then(({ document_list, page_navigation }) => {
                this.document_list = document_list;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
