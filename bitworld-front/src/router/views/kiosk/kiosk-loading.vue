<script>
export default {
  page: {
    title: 'KioskLoading',
    meta: [{ name: 'description', content: 'KioskLoading' }],
  },
}
</script>

<template>
  <Transition appear>
    <BaseIcon :class="$style.loadingIcon" name="sync" spin />
  </Transition>
</template>

<style lang="scss" module>
@import '@design';

.loadingIcon {
  @extend %typography-xxlarge;

  display: block;
  margin: 0 auto;

  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter-active) {
    transition: opacity 1s;
  }
  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter) {
    opacity: 0;
  }
}
</style>
