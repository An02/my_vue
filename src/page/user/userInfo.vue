<template>
  <el-container>
    <el-header height="100px"  background-color="#545c64">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        heigth="10px"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" class="title-line">首页</el-menu-item>
        <el-menu-item index="2" class="title-line">业务申请</el-menu-item>
        <el-menu-item index="3" class="title-line">订单管理</el-menu-item>
      </el-menu>
    </el-header>
    <el-container direction=" horizontal">
      <div style="background-color: #44555d; width: 200px; height: 750px">
        <el-aside width="200px" >
          <el-row class="tac" v-if="menu_key === '1'">
            <el-col :span="12">
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#44555d" text-color="#fff" active-text-color="#ffd04b">
                <el-row>
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>首页导航</span>
                    </template>
                    <el-menu-item>
                      <span slot="title">首页导航1-1</span>
                    </el-menu-item>
                    <el-menu-item>
                      <span slot="title">首页导航1-2</span>
                    </el-menu-item>
                  </el-submenu>
                </el-row>
                <el-row>
                  <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页导航二</span>
                  </el-menu-item>
                </el-row>
                <el-row>
                  <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">首页导航三</span>
                  </el-menu-item>
                </el-row>
              </el-menu>
            </el-col>
          </el-row>
          <el-row class="tac" v-if="menu_key === '2'">
            <el-col :span="12">
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#44555d" text-color="#fff" active-text-color="#ffd04b">
                <el-row>
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>业务导航</span>
                    </template>
                    <el-menu-item>
                      <span slot="title">业务导航1-1</span>
                    </el-menu-item>
                    <el-menu-item>
                      <span slot="title">业务导航1-2</span>
                    </el-menu-item>
                  </el-submenu>
                </el-row>
                <el-row>
                  <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">业务导航二</span>
                  </el-menu-item>
                </el-row>
                <el-row>
                  <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">业务导航三</span>
                  </el-menu-item>
                </el-row>
              </el-menu>
            </el-col>
          </el-row>
          <el-row class="tac" v-if="menu_key === '3'">
            <el-col :span="12">
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#44555d" text-color="#fff" active-text-color="#ffd04b">
                <el-row>
                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>订单导航</span>
                    </template>
                    <el-menu-item>
                      <span slot="title">订单导航1-1</span>
                    </el-menu-item>
                    <el-menu-item>
                      <span slot="title">订单导航1-2</span>
                    </el-menu-item>
                  </el-submenu>
                </el-row>
                <el-row>
                  <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">订单导航二</span>
                  </el-menu-item>
                </el-row>
                <el-row>
                  <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">订单导航三</span>
                  </el-menu-item>
                </el-row>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
      </div>
      <el-main>
        <el-button size="small" type="primary" icon="el-icon-document"  @click="select">测试
        </el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {userApi} from '@/service/user_api'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      activeIndex: '1',
      menu_key: '1',
      activeIndex2: '1',
      query: {
        id: '1'
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect (key, keyPath) {
      this.menu_key = key
      console.log(key)
      console.log(keyPath)
    },
    select () {
      debugger
      userApi.getUserInfo(this.query).then(res => {
        console.log('进入请求结果！！！')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
li[data-v-b63b5314] {
  display: inline-block;
  margin: 0 20px;
  height: 60px;
}
</style>

<style>
  .title-line {
    padding-top: 40px;
    text-align: left;
  }
  .tac {
  }
</style>
