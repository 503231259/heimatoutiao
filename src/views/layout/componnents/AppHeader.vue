<template>
    <div>
       <el-col :span="6" class="left">江苏传智播客教育科技股份有限公司</el-col>
       <el-col :span="4" :offset="14">
         <el-dropdown>
           <span class="el-dropdown-link">
             <img :src="userInfo.photo" width="30">
             {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
           </span>
         <el-dropdown-menu slot="dropdown">
           <el-dropdown-item>账户设置</el-dropdown-item>
           <el-dropdown-item>退出</el-dropdown-item>
         </el-dropdown-menu>
         </el-dropdown>
       </el-col>
    </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  // 在生命钩子设置
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #000000;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
