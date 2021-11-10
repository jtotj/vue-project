<template>
    <sweet-modal ref="modal" icon="warning" @close="onClose">
        {{ message }}
    </sweet-modal>
</template>

<script>
export default {
    name: 'modal',
    data() {
        return {
            callback: function() {},
            message: '',
            type: 'alert'
        }
    },
    methods: {
        open(callback, message, type) {
            console.log('test');
            this.callback = callback || function() {};
            this.message = message;
            this.type = type || 'alert';
            this.$refs.modal.open();
        },
        close() {
            this.$refs.modal.close();
        },
        onClose() {
            this.$store.dispatch('closeModal', true);

            return this.callback(null);
        }
    }

}
</script>
