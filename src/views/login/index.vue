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
              <!-- <el-button @click="hansleSendCode">获取验证码</el-button> -->
              <el-button
              @click="handleSendCode"
              :disabled="!!codeTimer"
              >
              {{ codeTimer ? `剩余${codeSecons}秒` : '获取验证码' }}
              </el-button>
            </el-col>
          </el-form-item>
           <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
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
// 引入第三方插件
import axios from 'axios'
// 引入 element
import '@/vendor/gt'
// 定时器时间
const initCodeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      // 表单数据
      form: {
        mobile: '',
        code: '',
        agree: ''
      },
      loginLoading: false,
      // 规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { required: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      // 通过 initGeetest 得到的极验验证码对象
      captchaObj: null,
      // 定时器定时时间
      codeSecons: initCodeSeconds,
      // 定时器
      codeTimer: null,
      // 保存初始化验证码之后发送短信的手机号
      sendMobile: ''
    }
  },
  methods: {
    // 点击登录
    handleLogin () {
      //   console.log("登录");
      // 检查表单
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 发送表单,登录
        this.submitLogin()
      })
    },
    // 发送表单数据,登录(封装)
    submitLogin () {
      // 发送请求
      axios({
        // 发送类型
        method: 'post',
        // 发送地址
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        // 发送数据
        data: this.form
      })// 接收数据
        .then(res => {
          // 弹出框
          this.$message({
            message: '恭喜你，这是一条成功消息',
            type: 'success'
          })
          // 路由跳转
          this.$router.push({
            name: 'home'
          })
        })// 接收错误消息
        .catch(err => {
          // 消息类型是400 提示
          if (err.response.status === 400) {
            this.$message.error('错了哦，这是一条错误消息')
          }
        })
    },
    // 发送验证码
    handleSendCode () {
      //   console.log('验证码');获取对部分表单字段进行校验的方法
      // 校验手机号是否有效   传入要校验的一个数据
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // 返回数据,分析有用的
        if (errorMessage.trim().length > 0) {
          // 满做这个条件  则停止运行
          return
        }
        // 查看是否有验证插件对象
        if (this.captchaObj) {
          // 如果验证的手机号码不等于网页上的手机号码
          if (this.form.mobile !== this.sendMobile) {
            // 移除之前的验证码框dom
            document.body.removeChild(document.querySelector('.geetest_panel'))
            // 重新发送
            this.showGeetest()
          } else {
            // 一致的话
            this.captchaObj.verify()
          }
        } else {
          //  发送验证码
          this.showGeetest()
        }
      })
    },
    // 发送验证码(封装)
    showGeetest () {
      // 发送请求
      axios({
        // 方式
        method: 'GET',
        // 地址
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.form.mobile}`
        // 接收结果
      }).then(res => {
        // 保存数据
        let data = res.data.data
        // 使用极验的文档(查看极验文档)
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind'
          },
          // 函数中的function定义的函数中的this指向window
          captchaObj => {
            this.captchaObj = captchaObj

            captchaObj
              .onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码
                // 将表单中的手机号保存另一份
                this.sendMobile = this.form.mobile
                captchaObj.verify() // 显示验证码(弹出框)
              })
              .onSuccess(() => {
                // your code
                // console.log('驗證成功');
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                // 发送请求
                axios({
                  // 方式
                  method: 'get',
                  // 地址
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${this.formmobile}`,
                  // get方式的数据
                  params: {
                    challenge,
                    seccode,
                    validate
                  }
                  // 接收数据
                }).then(res => {
                  // console.log(res.data)
                  // 发送短信之后,开始倒计时
                  this.codeCountDown()
                })
              })
          }
        )
      })
    },
    // 倒计时
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds// 让倒计时事件回到初始状态
          window.clearInterval(this.codeTimer) // 清除定时器
          this.codeTimer = null // 清除倒计时定时器标志
        }
      }, 1000)
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
