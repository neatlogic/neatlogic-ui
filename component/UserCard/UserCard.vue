<template>
  <div
    v-click-outside:false="onClickOutside"
    v-click-outside:false.mousedown="onClickOutside"
    v-click-outside:false.touchstart="onClickOutside"
    class="usercard-container"
    tabindex="-1"
    @click.stop
  >
    <Poptip
      ref="Poptip"
      v-model="isshow"
      width="400"
      transfer
    >
      <span class="usercard-rel" @click="getUserinfo(item.useruuid || item.userid)">
        <img :src="avatar[item.type || 'default']" class="usercard-smallicon" :alt="item.username" />
        <span>{{ item.username || userName || '暂无用户名' }}</span>
        <span v-if="item.unit">{{ item.unit }}</span>
      </span>
      <div slot="content" ref="dropdown">
        <div class="clearfix">
          <div v-if="item.type && item.type != 'user' && userId" class="ts-angle-left text-href" @click.stop="gotoList(item.type || null)">{{ item.username }}</div>
          <i class="ts-remove btn-close-usercard" @click.stop="close()"></i>
        </div>
        <Loading v-if="!isLoad" loadingShow></Loading>
        <template v-else>
          <UserInfo v-if="userId" :uuid="userId" :userConfig="userConfig"></UserInfo>
          <div v-else-if="item.type == 'team'">
            <TsRow :gutter="0">
              <Col v-for="(user, uindex) in userList" :key="uindex" span="8">
              <div class="usercard-li overflow" @click="showUser(user)">
                <img
                  :src="avatar['default']"
                  class="usercard-smallicon"
                  :alt="user.username"
                  :title="user.userName"
                />
                {{ user.userName }}
              </div>
              </Col>
            </TsRow>
          </div>
        </template>
      </div>
    </Poptip>
  </div>
</template>
<script>
import avatar1 from '../../static/images/default-avatar.png';
import avatar2 from '../../static/images/role-avatar.png';
import avatar3 from '../../static/images/team-avatar.png';
import axios from '../../api/http.js';
import UserInfo from './UserInfo.vue';
import { directive as ClickOutside } from '../../directives/v-click-outside-x';
export default {
  name: 'UserCard',
  directives: { ClickOutside },
  components: {
    UserInfo
  },
  props: ['item'],
  data() {
    return {
      avatar: {
        //头像不同类型映射的名字
        default: avatar1,
        user: avatar1,
        role: avatar2,
        team: avatar3
      },
      cancelAxios: null,
      isshow: false,
      isExist: false,
      isLoad: false,
      userConfig: {},
      userId: null, //当前组件的用户id，就算是分组角色组件，每次切换下一层也是只有一个userid
      userName: null,
      userList: [] //分组角色用
    };
  },

  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    if (!this.item.type || this.item.type == 'user') {
      this.userId = this.item.useruuid || this.item.userid;
    }
    if (this.item && !this.item.username) {
      this.getUserinfo(this.item.useruuid || this.item.userid);
    }
  },
  beforeDestroy() {},

  methods: {
    getUserinfo(id) {
      let _this = this;
      if (_this.isshow && this.item.type != 'team') {
        return;
      }
      _this.isLoad = false;
      let cancel = this.cancelAxios;
      cancel && (this.cancelAxios = null) && cancel.cancel();
      const CancelToken = axios.CancelToken;
      this.cancelAxios = CancelToken.source();
      if (this.userId) {
        let userUuid = id.indexOf('#') > -1 ? id.split('#')[1] : id;
        axios
          .post('/api/rest/user/get', { userUuid: userUuid }, Object.assign({ headers: { unConsole: 1 } }))
          .then(res => {
            _this.isLoad = true;
            if (res && res.Status == 'OK') {
              _this.isExist = true;
              _this.userId = res.Return.userId || null;
              _this.$set(_this.userConfig, 'teamNameList', res.Return.teamNameList || []);
              _this.$set(_this.userConfig, 'roleList', res.Return.roleList || []);
              _this.$set(_this.userConfig, 'isActive', res.Return.isActive || 0);
              _this.$set(_this.userConfig, 'userId', res.Return.userId || null);
              _this.$set(_this.userConfig, 'userName', res.Return.userName || null);
            } else {
              _this.isExist = false;
            }
            //_this.$refs.Poptip.updatePopper();
          })
          .catch(e => {
            _this.isLoad = true;
          });
      } else if (this.item.type == 'team') {
        _this.userId = null;
        axios
          .post('/api/rest/team/user/list', { teamUuid: id }, { unConsole: 1 })
          .then(res => {
            _this.isLoad = true;
            if (res && res.Status == 'OK') {
              _this.userList = res.Return.teamUserList || [];

              _this.isExist = true;
            } else {
              _this.isExist = false;
            }
            this.$refs.dropdown.update();
          })
          .catch(e => {
            _this.isLoad = true;
          });
      }
    },
    close() {
      this.isshow = false;
    },
    show() {
      this.isshow = true;
    },
    onClickOutside(event) {
      const $el = this.$refs.dropdown ? this.$refs.dropdown || null : null;
      if (!$el || $el === event.target || $el.contains(event.target)) {
        return;
      }
      this.isshow = false;
    },
    showUser(user) {
      if (user && user.userUuid) {
        this.userId = user.userUuid;
        this.getUserinfo(this.userId);
      }
    },
    gotoList(type) {
      if (type && type != 'user') {
        this.userId = null;
        this.getUserinfo(this.item.useruuid || this.item.userid);
      }
    }
  },
  computed: {},
  watch: {
    isshow(val) {
      if (!val && this.item.type == 'team') {
        this.userId = null;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@user-prev: usercard;
.@{user-prev}-rel {
  display: block;
  cursor: pointer;
}
.@{user-prev}-smallicon {
  width: 24px;
  margin-right: 6px;
  vertical-align: middle;
}

.btn-close-@{user-prev} {
  cursor: pointer;
  float: right;
}

.@{user-prev}-container {
  &:focus {
    outline: none;
  }
}

.@{user-prev}-li {
  padding-top: 4px;
  padding-bottom: 4px;
  cursor: pointer;
}
</style>
