<template>
  <div>
    <div v-if="isExist" class="usercard-body">
      <div class="usercard-left">
        <table class="usercard-table">
          <tbody>
            <tr>
              <td style="padding-left:0;padding-right:0">
                <div class="text-center">
                  <img :src="avatar" class="usercard-bigicon" :alt="userName" />
                </div>
                <div class="overflow" style="width:80px;" :title="userName">{{ userName }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="usercard-right">
        <div class="usercard-item">
          <div class="text-grey usercard-label">ID</div>
          <div class="usercard-text">{{ userId }}</div>
        </div>
        <div class="usercard-item">
          <div class="text-grey usercard-label">角色</div>
          <div v-if="roleList && roleList.length > 0" class="usercard-text">
            <span v-for="(role, rindex) in roleList" :key="rindex" class="usercard-itemlist">{{ role.description }}</span>
          </div>
          <div v-else>-</div>
        </div>
        <div class="usercard-item">
          <div class="text-grey usercard-label">分组</div>
          <div v-if="teamNameList && teamNameList.length > 0" class="usercard-text">
            <span v-for="(team, tindex) in teamNameList" :key="tindex" class="usercard-itemlist">{{ team }}</span>
          </div>
          <div v-else>-</div>
        </div>
      </div>
    </div>
    <div v-else class="text-center"> <img :src="avatar" class="usercard-smallicon" />该用户不存在</div>
  </div>
</template>

<script>
import image from '../../static/images/default-avatar.png';
import axios from '../../api/http.js';
export default {
  name: 'UserInfo',
  components: {
  },
  props: ['uuid', 'userConfig'],
  data() {
    return {
      avatar: image,
      isExist: false, //是否存在该用户
      teamNameList: null,
      roleList: null,
      isActive: 0,
      userId: null, //当前组件的用户id，就算是分组角色组件，每次切换下一层也是只有一个userid
      userName: null
    };
  },

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {},

  beforeUpdate() {},

  updated() {},

  activated() {},

  deactivated() {},

  beforeDestroy() {},

  destroyed() {},

  methods: {
    getUserinfo(config) {
      this.isExist = true;
      this.teamNameList = config.teamNameList || [];
      this.roleList = config.roleList || [];
      this.isActive = config.isActive || 0;
      this.userId = config.userId || null;
      this.userName = config.userName || null;
    }
  },

  filter: {},

  computed: {},

  watch: {
    'userConfig': {
      handler: function(val) {
        if (val) {
          this.getUserinfo(val);
        } else {
          this.isExist = false;
        }
      },
      immediate: true,
      deep: true
    }
  }

};

</script>
<style lang='less' scoped>
@user-prev: usercard;
.@{user-prev}-bigicon {
  width: 36px;
}
.@{user-prev}-body {
  position: relative;
  padding-left: 80px;
  min-height: 66px;
  .@{user-prev}-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    .usercard-table {
      height: 100%;
      width: 100%;
    }
  }
  .@{user-prev}-right {
    .@{user-prev}-item {
      position: relative;
      padding-left: 70px;
      .@{user-prev}-label {
        text-align: right;
        width: 60px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .@{user-prev}-text {
        max-width: 200px;
        word-break: break-all;
        white-space: normal;
      }
    }
    .@{user-prev}-itemlist {
      &:not(:last-of-type) {
        &:after {
          content: '、';
          width: 14px;
          opacity: 0.6;
          display: inline-block;
          text-align: center;
        }
      }
    }
  }
}
</style>
