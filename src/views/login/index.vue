<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form :model="form" ref="form">
          <el-form-item>
            <el-input v-model="form.name" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="hansleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn-login" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '13351234766',
        code: ''
      },
      rules: {
        name: []
      }
    }
  },
  methods: {
    onSubmit () {
    //   console.log("登录");
    },
    hansleSendCode () {
      //   console.log('验证码');
      const { mobile } = this.form

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  // 主轴 中心
  justify-content: center;
  // 侧轴 中心
  align-items: center;
  background-color: #ccc;

  .login-head {
    display: flex;
    // 主轴中心
    justify-content: center;
    margin-bottom: 10px;

    img {
      width: 200px;
    }
  }
  //   显示的主体
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;

    .btn-login {
      width: 100%;
    }
  }
}
</style>
