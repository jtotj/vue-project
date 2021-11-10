<template>
    <div class="paging_wrap">
        <div class="inline">
            <router-link :to="{ query: Object.assign({}, $route.query, { page: undefined }) }" @click="$emit('change', 1)" class="fa fa-angle-double-left"></router-link>
            <router-link :to="{ query: Object.assign({}, $route.query, { page: Math.max(cur_page - 1, 1) }) }" @click="$emit('change', Math.max(cur_page - 1, 1))" class="fa fa-angle-left"></router-link>
            <router-link :to="{ query: Object.assign({}, $route.query, { page: page_no }) }" v-for="page_no in page_nos" @click.prevent="$emit('change', page_no)" :class="{ on: page_no == cur_page }">{{ page_no }}</router-link>
            <router-link :to="{ query: Object.assign({}, $route.query, { page: Math.min(cur_page + 1, page_navigation.last_page) }) }" @click="$emit('change', Math.min(cur_page + 1, page_navigation.last_page))" class="fa fa-angle-right"></router-link>
            <router-link :to="{ query: Object.assign({}, $route.query, { page: page_navigation.last_page }) }" @click="$emit('change', page_navigation.last_page)" class="fa fa-angle-double-right"></router-link>
        </div>
    </div>
</template>

<script>
import PageHandler from '@/classes/PageHandler'
export default {
    name: 'PageNavigation',
    props: [
        'total_page',
        'cur_page',
        'total_count',
        'page_count'
    ],
    computed: {
        page_navigation: function() {
            return new PageHandler(this.total_count, this.total_page || 1, this.cur_page, this.page_count)
        },
        page_nos: function() {
            var page_nos = [];
            var page_no = null;

            while(page_no = this.page_navigation.getNextPage()) {
                page_nos.push(page_no);
            }

            return page_nos;
        }
    }
}
</script>
