/* eslint-disable */
import store from '../vuex/store';
import _ from 'lodash';

const Common = {
    store,
    install (Vue) {
        Vue.prototype.$store = store;

        Vue.mixin({
            methods: {
                $request(callback, method, path, params = {}, silent = false, handle_error = true) {
                    var vm = this;

                    if(!silent) vm.$store.dispatch('increaseRequest');

                    this.$http[method](path, method == 'get' ? { params, headers: { 'X-Requested-With': 'XMLHttpRequest' } } : params, { headers: { 'Content-Type': 'application/json' } }).then(function({ data }) {
                        if(!silent) vm.$store.dispatch('decreaseRequest');

                        data = _.extend({}, data, data.variables);
                        delete data.variables;

                        if(data.error && handle_error) return vm.$openModal(function() {
                            callback(data);
                        }, data.message, 'alert-error');

                        else if(data.error && !handle_error)
                            return callback(data);

                        return callback(null, data);
                    })
                },
                
                $openModal(callback, message, type) {
                    this.$store.dispatch('openModal', { callback, message, type });
                },

                fromPairs() {
                    return _.fromPairs.apply(_, arguments);
                }
            }
        })
    }
}

export default Common