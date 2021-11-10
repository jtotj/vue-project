<template>
  <div class="foreground-container">
    <div class="container">
      <div :class="[$style.cocobnkGuide]">
        <div :class="[$style.guideTitleBox]">
          <h2>
            {{ $t('guide.guide_title_1') }}
          </h2>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_1') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_1') }}
            </h4>
          </div>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_2') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_3') }} <br />
              {{ $t('guide.guide_strapline_msg_4') }} <br />
              {{ $t('guide.guide_strapline_msg_5') }} <br />
            </h4>
          </div>
        </div>
        <div :class="[$style.guideTitleBox]">
          <h2>
            {{ $t('guide.guide_title_2') }}
          </h2>

          <table>
            <tr>
              <th :class="[$style.tableColorLeft]"
                ><h3>{{ $t('guide.guide_strapline_3') }}</h3></th
              >
              <th :class="[$style.tableColorRight]"
                ><h3>{{ $t('guide.guide_strapline_4') }}</h3></th
              >
            </tr>
            <tr>
              <td :class="[$style.tableColorLeft]">
                <h4>
                  {{ $t('guide.guide_strapline_msg_6') }} <br />
                  {{ $t('guide.guide_strapline_msg_7') }} <br />
                  {{ $t('guide.guide_strapline_msg_8') }}
                </h4>
              </td>
              <td :class="[$style.tableColorRight]">
                <h4>
                  {{ $t('guide.guide_strapline_msg_9') }} <br />
                  {{ $t('guide.guide_strapline_msg_10') }}<br />
                  {{ $t('guide.guide_strapline_msg_11') }}
                </h4>
              </td>
            </tr>
          </table>
        </div>

        <div :class="[$style.guideTitleBoxAlign]">
          <h2>
            {{ $t('guide.guide_title_3') }}
          </h2>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_5') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_12') }}
            </h4>
          </div>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_6') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_13') }}
            </h4>
          </div>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_7') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_14') }}
            </h4>
          </div>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_8') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_15') }}
            </h4>
          </div>
          <div :class="[$style.guideStraplineBox]">
            <h3>
              {{ $t('guide.guide_strapline_9') }}
            </h3>
            <h4>
              {{ $t('guide.guide_strapline_msg_16') }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/guide.scss';
</style>
