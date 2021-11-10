<script>
export default {
  name: 'wrapper-component',
  render(createElement) {
    return createElement(
      'template',   // tag name
      this.$slots.default // array of children
    );
  },
}
</script>
