<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form :model="form" ref="ruleForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="hansleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn-login" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@/vendor/gt";

export default {
  name: "AppLogin",
  data() {
    return {
      form: {
        mobile: "",
        code: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { len: 11, message: "长度必须为11个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "长度必须为6个字符", trigger: "blur" }
        ]
      },
      captchaObj: null
    };
  },
  methods: {
    handleLogin() {
      //   console.log("登录");
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return;
        }
        this.submitLogin();
      });
    },
    submitLogin() {
      axios({
        method: "post",
        url: "http://ttapi.research.itcast.cn/mp/v1_0/authorizations",
        data: this.form
      })
        .then(res => {
          this.$message({
            message: "恭喜你，这是一条成功消息",
            type: "success"
          });
          this.$router.push({
            name: "home"
          });
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.$message.error("错了哦，这是一条错误消息");
          }
        });
    },
    hansleSendCode() {
      //   console.log('验证码');
      const { mobile } = this.form;

      if (this.captchaObj) {
        return this.captchaObj.verify();
        // console.log(this.captchaObj);
      }

      axios({
        method: "GET",
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        let data = res.data.data;

        initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "bind"
          },
          captchaObj => {
            this.captchaObj = captchaObj;

            captchaObj
              .onReady(function() {
                //验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify(); //显示验证码
              })
              .onSuccess(function() {
                //your code
                // console.log('驗證成功');
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate();
                axios({
                  method: "get",
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  console.log(res.data);
                });
              });
          }
        );
      });
    }
  }
};
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
