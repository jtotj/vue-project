<template>
  <div>
    <h1>{{ $t('detaile_content') }}</h1>
    {{movie}}
  </div>
</template>

<script>
export default {
  created: function () {
    var id = this.$route.params.id
    this.$http.get(`/api/movies/${id}`)
    .then((response) => {
      this.movie = response.data
    })
  },
  data: function () {
    return {
      movie: {}
    }
  }
}
</script>

<style lang="css">

</style>
