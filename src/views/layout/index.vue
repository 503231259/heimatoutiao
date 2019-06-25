<template>
    <div class="app">
      <el-container>
        <el-aside width="200px"><AppAside></AppAside></el-aside>
        <el-container>
          <el-header class="try"><AppHeader></AppHeader></el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import AppAside from './componnents/AppAside'
import AppHeader from './componnents/AppHeader'

export default {
  name: 'layout',
  data () {
    return {
    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less" scoped>
.app{
    height: 100%;
    .el-container{
        height: 100%;
    }
    .try{
        padding: 0;
    }
}
 .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: left;
    line-height: 200px;
  }
  .el-main {
    background-color: #E9EEF3;
    padding: 0px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
