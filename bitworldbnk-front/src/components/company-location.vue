<script>
export default {}
</script>

<template>
  <div class="location">
    <div class="company-way">
      <div class="main-title">
        <h2>{{ $t('way_to_find') }}</h2>
      </div>
      <div class="head-office office">
        <h4>{{ $t('cocobank_korea_head_office') }}</h4>
        <p>
          {{ $t('address_head_office') }}
        </p>
      </div>
      <!-- <div class="branch-office office">
        <h4>{{ $t('cocobank_branch_office') }}</h4>
        <p>
          {{ $t('address_branch_office') }}
        </p>
      </div> -->
      <div class="company-map">
        <!-- {{ $t('map') }} -->
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.098724146428!2d127.03955731603617!3d37.505589635372516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca407c487b3b1%3A0xffcc435eb62e3e08!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsl63sgrzrj5kg7Ja47KO866GcIDUyOA!5e0!3m2!1sko!2skr!4v1622445440109!5m2!1sko!2skr"
          width="100%"
          height="300"
          frameborder="0"
          style="border:0;"
          allowfullscreen=""
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.location {
  float: left;
  width: 46%;
  overflow: hidden;
}

.location .company-way h4 {
  padding-bottom: 10px;
}

.location .company-way .office {
  float: left;
  width: 50%;
}

.location .company-map {
  display: inline-block;
  width: 100%;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .location {
    width: 100%;
    margin-bottom: 40px;
  }
  .location .company-way .office {
    width: 100%;
  }

  .location .company-way .head-office {
    margin-bottom: 30px;
  }
}
</style>
