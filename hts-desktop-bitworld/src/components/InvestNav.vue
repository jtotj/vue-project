<template>
    <nav class="invest_menu">
        <ul>
            <li style="width: 50%;"><router-link :to="{ name: 'invest' }">{{ $t('holding_coin') }}</router-link></li>
            <li style="width: 50%;"><router-link :to="{ name: 'order' }">{{ $t('transactional_information') }}</router-link></li>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'InvestNav',
}
</script>
