<template>
    <div class="cnt" v-loading="loading">
        <h3>{{ $t('notice') }}</h3>
        <div class="table_box board">
            <table>
                <colgroup><col width=""><col width=""><col width="80"><col width="100"><col width="80"><col width="100"></colgroup>
                <tbody>
                    <tr>
                        <td class="a_l" style="font-size:18px; border:none;">{{ oDocument.title }}</td>
                        <th></th>
                        <td style="border:none;"></td>
                        <th style="border:none;"></th>
                        <th style="border:none;">{{ $t('reporting_date') }}</th>
                        <td style="border:none;">{{ func.zdate(oDocument.regdate, 'Y-m-d') }}</td>
                    </tr>
                    <tr style="background:#fff;">
                        <th></th>
                        <td></td>
                        <th></th>
                        <td></td>
                        <th>{{ $t('hits') }}</th>
                        <td>{{ php.number_format(oDocument.readed_count) }}</td>
                    </tr>
                    <tr style="background:#fff;">
                        <td colspan="6" class="context a_l" v-html="oDocument.content"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="board_btn">
            <a href="#" @click.prevent="$router.go(-1)" class="list">{{ $t('list') }}</a>
        </div>
    </div>
</template>


<script>
import { fetchDocument } from '@/api/document'
import func from '@/classes/func.inc'
import php from 'phpjs'

export default {
    name: 'notice-view-cs',
    data() {
        return {
            loading: false,
            oDocument: {},
            php,
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
            this.loading = true;
            return fetchDocument('notice', this.$route.params.document_srl).then(({ oDocument }) => {
                this.oDocument = oDocument;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
