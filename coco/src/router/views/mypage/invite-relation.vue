<script>
import { fetchInviteRelation } from '@apis/member'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      invite_relation: [],
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'child_user_id',
      },
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  mounted() {
    this.loadInviteRelation()
  },
  methods: {
    async loadInviteRelation() {
      const ret_obj = await fetchInviteRelation({
        ...this.$route.query,
        no_paging: 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.invite_relation = ret_obj.data

      this.tree = this.flatToHierarchy(ret_obj.data)
    },
    flatToHierarchy(flat) {
      const root_seq = this.currentUser.seq
      const root = {
        child_user_id: this.currentUser.user_id,
        child_seq: root_seq,
        child_is_alive: this.currentUser.child_is_alive,
      }
      const roots = [root]

      const all = { [root_seq]: root }

      flat.forEach((item) => {
        all[item.child_seq] = item
      })

      Object.keys(all).forEach((child_seq) => {
        const item = all[child_seq]

        if (item.child_inviter_seq in all) {
          const p = all[item.child_inviter_seq]
          if (!('children' in p)) {
            this.$set(p, 'children', [])
          }
          p.children.push(item)
        }
      })

      return roots
    },
  },
}
</script>
<template>
  <div class="foreground-container">
    <div class="container">
      <!-- <OrganizationChart
          :datasource="tree"
          >
          <template slot-scope="{ nodeData }">
            <div class="title">{{ nodeData.child_user_id }}</div>
          </template>
      </OrganizationChart> -->

      <el-tree :data="tree" :props="defaultProps">
        <template slot-scope="{ data }">
          <i class="el-icon-user-solid">
            <span
              :class="[
                $style.accountBlock,
                {
                  [$style.textDecoration]: data.child_is_alive === null,
                },
              ]"
            >
              {{ data.child_user_id }}
            </span>
            <span
              v-if="data.child_is_alive === null"
              :class="[
                $style.accountBlock,
                {
                  [$style.color]: data.child_is_alive === null,
                },
              ]"
            >
              탈퇴한 회원입니다.
            </span>
          </i>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/invite-relation.scss';
</style>
