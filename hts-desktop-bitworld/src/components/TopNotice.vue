<template>
    <div class="top" v-if="notice_list.length">
        <div class="wrapper">
            <slot></slot>
            <transition name="fade" tag="div" mode="out-in">
                <router-link v-for="(document, idx) in notice_list" v-if="idx === 0" :key="document.document_srl" :to="{ name: 'noticeView', params: { document_srl: document.document_srl } }">{{ document.title }}</router-link>
            </transition>
        </div>
    </div>
</template>

<style scoped>
    .fade-enter-active, .fade-leave-active {
      transition: opacity 1s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
</style>

<script>
import { mapState } from 'vuex';

export default {
    name: 'TopNotice',
    data() {
        return {
            notice_list: [],
            interval_seq: null,
        }
    },
    computed: {
        ...mapState({
            news: ({ common }) => common.news,
        })
    },
    watch: {
        news(to) {
            this.notice_list = [].concat(to);
        }
    },
    created: function() {
        this.notice_list = [].concat(this.news);

        this.interval_seq = setInterval(this.updateTicker, 5000);
    },
    methods: {
        updateTicker: function() {
            if(!this.notice_list.length) return;

            var removed = this.notice_list.pop();
            this.notice_list.unshift(removed);
        }
    },
    beforeDestroy() {
        clearInterval(this.interval_seq);
    }
}
</script>
