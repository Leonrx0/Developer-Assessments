<template>
  <div class="sideBox">
    <el-container class="admin">
      <el-aside style="min-height: 100vh;width: 170px;">
        <el-menu :default-active="activeMenu" class="menu" router>
          <el-menu-item index="default">首页</el-menu-item>
          <!--            <el-sub-menu index="rank" v-if="technologyRank">-->
          <!--              <template #title>应用</template>-->
          <el-menu-item index="rank" @click="goPageRank()">技术排名</el-menu-item>
          <el-menu-item index="select">用户查询</el-menu-item>
          <el-menu-item index="add">添加用户</el-menu-item>
          <el-menu-item index="search">关键词搜索</el-menu-item>
          <!--            </el-sub-menu>-->
          <!--            <el-sub-menu index="select" v-if="userSelect">-->
          <!--              <template #title>用户查询</template>-->
          <!--              <el-menu-item index="select">用户查询</el-menu-item>-->
          <!--            </el-sub-menu>-->
          <!--            <el-sub-menu index="add" v-if="userAdd">-->
          <!--              <template #title>添加用户</template>-->
          <!--              <el-menu-item index="add">添加用户</el-menu-item>-->
          <!--            </el-sub-menu>-->
          <!--            <el-sub-menu index="search" v-if="keySearch">-->
          <!--              <template #title>关键词搜索</template>-->
          <!--              <el-menu-item index="search">关键词搜索</el-menu-item>-->
          <!--            </el-sub-menu>-->
        </el-menu>
      </el-aside>
      <el-container class="content">
        <!-- 排行榜 -->
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>
  
  <script>
  import mRank from "@/components/content/rank.vue"
  import mDefault from "@/components/content/default.vue"
  import mPredict from "@/components/content/userSelect.vue"
  import router from "@/router/index.js";
  export default {
    name: "Asider",
    components:{
        mRank,mDefault,mPredict
    },
    data() {
      return {
        activeMenu: 'index',
        // 技术排名
        technologyRank: true,
        // 用户查询
        userSelect: true,
        // 用户添加
        userAdd: true,
        // 关键词搜索
        keySearch:true,
        userName: 'John Doe',
      };
    },
    methods: {
      toggleSubMenu() {
        this.subMenuVisible = !this.subMenuVisible;
      },
      goPageRank(){
        router.push('/rank')
      },
      goSeclectRank(){
        router.push('/select')
      },
      goAddRank(){
        router.push('/add')
      },
      goKeySearch(){
        router.push('/search')
      },
    },
  };
  </script>
  
  <style>
  .sideBox{
    .admin{

    }
    .content{
      margin-top: 70px;
    }

  }

  
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menu{
    background-color: gray;
    height: 100%;
  }

  </style>
  
  


