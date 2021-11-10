<template>
    <div class="cnt">
        <h3>{{ $t('csnav.contact_us') }}</h3>
        <form v-loading="loading" @submit.prevent="submit" class="table_box">
            <table>
                <tbody>
                    <tr>
                        <th scope="row">{{ $t('title') }}
</th>
                        <td>
                            <div class="contact_form">
                                <input type="text" v-model="params.title" :placeholder="$t('cmd_enter_title')" />
                            </div>
                        </td>
                    </tr>
                    <tr style="background:none;">
                        <th scope="row">{{ $t('csnav.matters_inquiry') }}
</th>
                        <td>
                            <div class="contact_form">
                                <textarea v-model="params.content" :placeholder="$t('cmd_detail_enquire')"></textarea>
                                <p class="counting">
                                    <span>{{ params.content.length }}</span>/1000
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="contact_btn">
                <button type="submit" class="submit">{{ $t('submit') }}</button>
                <button @click.prevent="$router.push({ name: 'cs' })" class="cancel">{{ $t('cancel') }}</button>
            </div>
        </form>
    </div>
</template>

<script>
import { createDocument } from '@/api/document'
import func from '@/classes/func.inc'
import php from 'phpjs'

export default {
    name: 'contact-cs',
    data() {
        return {
            loading: false,
            oDocument: {},
            params: {
                title: this.$route.params.cmd_enter_title_account || '',
                content: '',
                allow_comment: 'Y',
            },
            php,
            func,
        }
    },
    methods: {
        submit() {
            this.loading = true;
            return createDocument('contact', this.params).then(({ message }) => {
                this.$toasted.info(message);
                this.$router.push({ name: 'myqna' });
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
