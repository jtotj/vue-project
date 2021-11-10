<script>
import FundInfo from '@components/fund-info'

export default {
  page: {
    title: 'FundInfo',
    meta: [{ name: 'description', content: 'FundInfo' }],
  },
  components: { FundInfo },
}
</script>

<template>
  <div>
    <FundInfo> </FundInfo>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
