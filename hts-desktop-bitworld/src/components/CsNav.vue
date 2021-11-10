<template>
    <div>
        <nav>
            <h2>{{ $t('footer.customer_service_center') }}</h2>
            <ul>
                <li><router-link :to="{ name: 'notice' }">{{ $t('notice') }}</router-link></li>
               <!--  <li><router-link v-if="0" :to="{ name: 'guide' }">{{ $t('csnav.operation_guide') }}</router-link></li> -->
                <li><router-link :to="{ name: 'fee' }">{{ $t('csnav.fee_guide') }}</router-link></li>
                <!-- <li><router-link v-if="0" :to="{ name: 'policy' }">{{ $t('csnav.policy_notification') }}</router-link></li> -->
                <li><router-link :to="{ name: 'contact' }">{{ $t('csnav.contact_us') }}</router-link></li>
                <li><router-link :to="{ name: 'myqna' }">{{ $t('csnav.inquiry_details') }}</router-link></li>
                <li><router-link :to="{ name: 'faq' }">{{ $t('csnav.faq') }}</router-link></li>
            </ul>
        </nav>
        <router-view class="cnt"></router-view>
    </div>
</template>

<script>
export default {
    name: 'CsNav',
}
</script>
