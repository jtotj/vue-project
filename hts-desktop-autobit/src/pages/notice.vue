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
import async from 'async';
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
        this.init();
    },
    methods: {
        init() {
            async.auto({
                document_list: (callback) => this.loadDocumentList(callback),
            })
        },

        loadDocumentList(callback) {
            this.$request((error, result) => {
                if(error) return callback(error);

                this.document_list = result.document_list;

                callback(error);
            }, 'post', 'https://app.cocofx.com/notice', 'act=dispBoardContentList&module=board&mid=notice')
        }
    }
}
</script>
