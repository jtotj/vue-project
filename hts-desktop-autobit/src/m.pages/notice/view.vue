<template>
    <section class="container">
        <div class="noticeB">
            <span class="tit">
                <strong>{{ document.title }}</strong>
                <em>{{ func.zdate(document.regdate) }}</em>
            </span>
            <span class="txt">
                <p v-html="document.content"></p>
            </span>
        </div>
    </section>
</template>

<style scoped>
.container .noticeB { width: 100%; overflow: hidden }
.container .noticeB ul li { width: 100%; border-bottom: 1px solid #eee }
.container .noticeB ul li:last-child { border-bottom: 0 }
.container .noticeB ul li a { display: block; width: 100%; padding: 13px 12px 9px; box-sizing: border-box }
.container .noticeB ul li a p { color: #333; font-size: 1em }
.container .noticeB ul li a em { color: #999; font-size: .88em }
.container .noticeB span.tit { display: block; width: 100%; padding: 13px 12px 9px; border-bottom: 1px solid #eee; box-sizing: border-box }
.container .noticeB span.tit strong { display: block; line-height: 1.4em; color: #333; font-size: 1.08em; font-weight: 600 }
.container .noticeB span.tit em { display: block; margin: 3px 0 0; color: #999; font-size: .94em }
.container .noticeB span.txt { display: block; width: 100%; padding: 0 12px 40px; border-bottom: 1px solid #eee; box-sizing: border-box }
.container .noticeB span.txt p { margin: 22px 0 0; color: #666; font-size: 1em; line-height: 1.45em }
.container .noticeB span.txt p:first-child { margin-top: 18px }
</style>

<script>
import { fetchDocument } from '@/api/document'
import func from 'classes/func.inc';

export default {
    name: 'notice',
    data() {
        return {
            document: {},
            func,
        }
    },
    mounted() {
        this.loadDocument();
    },
    watch: {
        '$route.params.document_srl'() {
            this.loadDocument();
        }
    },
    methods: {
        loadDocument() {
            return fetchDocument('notice', this.$route.params.document_srl).then(({ oDocument }) => {
                this.document = oDocument;
            }).catch(() => {
            })
        }
    }
}
</script>
