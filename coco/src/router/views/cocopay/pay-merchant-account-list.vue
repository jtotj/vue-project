<script>
// import PageNavigation from '@components/page-navigation'
import date from 'locutus/php/datetime/date'
import { fetchAssets } from '@apis/asset'

export default {
  name: 'Paymerchantaccount',
  page: {
    title: 'PayMerchantAccountList',
    meta: [
      {
        name: 'description',
        content: 'PayMerchantAccountList',
      },
    ],
  },
  // components: { PageNavigation },
  data() {
    return {
      transaction_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      dialog_visible: false,
      options: [
        {
          value: '20210720-3-8733-29955',
          label: '20210720-3-8733-29955',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
        {
          value: 'Option3',
          label: 'Option3',
        },
        {
          value: 'Option4',
          label: 'Option4',
        },
        {
          value: 'Option5',
          label: 'Option5',
        },
      ],
      value: '',
      message: '',
    }
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      if (this.$route.params.merchant_seq) {
        this.loadMerchantTransactionList()
      } else {
        this.loadTransactionList()
      }
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    if (this.$route.params.merchant_seq) {
      this.loadMerchantTransactionList()
    } else {
      this.loadTransactionList()
    }
  },
  created() {
    ;(async () => {
      const promise = await fetchAssets()
      try {
        this.transaction_list = promise.data

        for (const index in this.transaction_list) {
          // remove text after T
          var str = this.transaction_list[index].regdate
          var num = str.indexOf('T')
          str = str.substring(0, num != -1 ? num : str.length)
          this.transaction_list[index].regdate = str
          // change key name
          if (this.transaction_list[index].hasOwnProperty('regdate')) {
            this.transaction_list[index].date = this.transaction_list[
              index
            ].regdate
            delete this.transaction_list[index].regdate
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  },
  methods: {
    submit() {
      this.dialog_visible = false
      console.log(`message${this.message}`)
    },
  },
}
</script>

<template>
  <div>
    <div class="pay-container marchant-account-list">
      <div class="top-tit">
        <h4 class="tit">{{ $t('header.calculation_account_list') }}</h4>
        <button type="button" class="btn-regi" @click="dialog_visible = true">{{
          $t('otp.otp_register')
        }}</button>
        <el-dialog
          :visible.sync="dialog_visible"
          top="0"
          modal="false"
          modal-append-to-body="false"
          :title="$t('cocopay.calculation_account_enroll')"
        >
          <div class="dia-con">
            <div class="line"></div>
            <div class="search-wrap">
              <input
                v-model="message"
                type="text"
                :placeholder="$t('cocopay.search_asset')"
              />
              <button type="submit"></button>
            </div>
            <el-select
              v-model="value"
              :placeholder="$t('cocopay.account_choice')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialog_visible = false">{{
              $t('cancel')
            }}</el-button>
            <el-button type="primary" @click="submit">{{
              $t('cocopay.ac_enroll')
            }}</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="pay-account-list">
        <el-table :data="transaction_list">
          <el-table-column prop="date" :label="$t('shop.shop_cre_date')">
          </el-table-column>
          <el-table-column prop="title" :label="$t('shop.shop_title')">
          </el-table-column>
          <el-table-column prop="id" :label="$t('shop.shop_id')">
          </el-table-column>
          <el-table-column
            prop="ac-number"
            :label="$t('affiliate.account_number')"
          >
          </el-table-column>
          <el-table-column prop="status" :label="$t('status')">
          </el-table-column>
          <el-table-column prop="assets" :label="$t('asset')">
          </el-table-column>
          <el-table-column prop="delete" :label="$t('pay_login.deleting')">
          </el-table-column>
        </el-table>
      </div>
      <!-- <PageNavigation
        :total_count="total_count"
        :total_page="page_navigation.total_page"
        :cur_page="page"
        :page_count="page_navigation.page_count"
      ></PageNavigation> -->
    </div>
  </div>
</template>
