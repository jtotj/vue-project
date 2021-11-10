<template>
    <div class="cnt" v-loading="loading">
        <h3>{{ $t('csnav.inquiry_details') }}</h3>
        <div class="table_box board">
            <table>
                <colgroup v-if="fromMobile">
                    <col width="100">
                    <col width="*">
                    <col width="100">
                    <col width="*">
                </colgroup>
                <colgroup v-else>
                    <col width="100">
                    <col width="">
                    <col width="80">
                    <col width="100">
                    <col width="80">
                    <col width="100">
                </colgroup>
                <tbody v-if="fromMobile">
                    <tr>
                        <th>{{ $t('title') }}</th>
                        <td class="a_l" colspan="3">{{ oDocument.title }}</td>
                    </tr>
                    <tr>
                        <th>{{ $t('mypage.date_time') }}</th>
                        <td>{{ func.zdate(oDocument.regdate, 'Y-m-d') }}</td>
                        <th>{{ $t('state') }}</th>
                        <td>
                            <i v-if="oDocument.comment_count" class="label success">{{ $t('complete_response') }}</i>
                            <i v-else class="label">{{ $t('waiting_response') }}</i>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="context a_l" style="white-space: pre-line;">{{ oDocument.content }}</td>
                    </tr>
                    <template v-if="oComment.comment_srl">
                        <tr>
                            <th>{{ $t('mypage.writer') }}</th>
                            <td>{{ oComment.nick_name }}</td>
                            <th>{{ $t('mypage.response_date') }}</th>
                            <td>{{ func.zdate(oComment.regdate, 'Y-m-d') }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="context a_l" v-html="oComment.content"></td>
                        </tr>
                    </template>
                </tbody>
                <tbody v-else>
                    <tr>
                        <th>{{ $t('title') }}</th>
                        <td class="a_l">{{ oDocument.title }}</td>
                        <th>{{ $t('mypage.date_time') }}</th>
                        <td>{{ func.zdate(oDocument.regdate, 'Y-m-d') }}</td>
                        <th>{{ $t('state') }}</th>
                        <td>
                            <i v-if="oDocument.comment_count" class="label success">{{ $t('complete_response') }}</i>
                            <i v-else class="label">{{ $t('waiting_response') }}</i>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" class="context a_l" style="white-space: pre-line;">{{ oDocument.content }}</td>
                    </tr>
                    <template v-if="oComment.comment_srl">
                        <tr>
                            <td style="font-size: 14px; color: #666; font-weight:bold; text-align:left; padding-left:36px;" colspan="2">{{ $t('mypage.answer') }}</td>
                            <th>{{ $t('mypage.writer') }}</th>
                            <td>{{ oComment.nick_name }}</td>
                            <th>{{ $t('mypage.response_date') }}</th>
                            <td>{{ func.zdate(oComment.regdate, 'Y-m-d') }}</td>
                        </tr>
                        <tr>
                            <td colspan="6" class="context a_l" v-html="oComment.content"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="board_btn">
            <a href="#" @click.prevent="$router.go(-1)" class="list">{{ $t('list') }}
</a>
        </div>
    </div>
</template>

<script>
import { fetchDocument, fetchCommentList } from '@/api/document'
import func from '@/classes/func.inc'
import php from 'phpjs'

export default {
    name: 'faq-cs',
    props: {
        fromMobile: {
            default: false,
        }
    },
    data() {
        return {
            loading: false,
            oDocument: {},
            oComment: {},
            php,
            func,
        }
    },
    mounted() {
        this.loading = true;
        Promise.all([this.loadDocument(), this.loadFirstComment()]).then(() => {
            this.loading = false;
        }).catch(() => {
            this.loading = false;
        })
    },
    methods: {
        loadDocument() {
            return fetchDocument('contact', this.$route.params.document_srl).then(({ oDocument }) => {
                this.oDocument = oDocument;
            })
        },
        loadFirstComment() {
            return fetchCommentList('contact', this.$route.params.document_srl).then(({ comment_list }) => {
                this.oComment = comment_list.shift() || {};
            })
        }
    }
}
</script>
