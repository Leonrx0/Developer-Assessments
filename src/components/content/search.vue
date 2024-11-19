<template>
  <div class="rankBox">
      <el-input v-model="params.key"  placeholder="Please input Keywords" class="input">
        <template #suffix>
          <el-icon class="el-input__icon" @click="keySearch(this.params.key)"><Search /></el-icon>
        </template>
      </el-input>
      <el-pagination
          layout="prev, pager, next, jumper, total"
          :page-size="this.params.size"
          :total="100"
          v-model:current-page="this.params.page"
          @current-change="handlePageChange"
      />
      <el-descriptions class="description" direction="vertical" border v-for="(item,index) in descriptionsConfigsKey[this.searchNum-1]" :key="index" :title="'No.'+(index+1)" >
        <el-descriptions-item label="Photo" width="250px"><img :src="item.avatar_url" alt=""></el-descriptions-item>
        <el-descriptions-item label="UserName" width="250px"><span v-html="item.name"></span></el-descriptions-item>
        <el-descriptions-item label="EMail" width="250px">{{item.email}}</el-descriptions-item>
        <el-descriptions-item label="Github" width="250px">{{item.html_url}}</el-descriptions-item>
        <el-descriptions-item label="Level" width="250px"><i :class="this.iconLevel" style="font-size: 30px"></i></el-descriptions-item>
        <el-descriptions-item label="Nation" width="250px">
          <span v-if="item.location!==null" v-html="item.location"></span>
          <el-button v-else @click="predictByNull(index)">
            预测
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="Field" width="250px"><span v-html="item.topic"></span></el-descriptions-item>
      </el-descriptions>
  </div>
</template>

<script >

import {searchByKey} from '@/request/api'
import "@/assets/iconfont/icon/iconfont.css"
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'mSearch',
  components: {Search},
  computed: {
    Search() {
      return Search
    }
  },
  data() {
    return {
      // 分页功能
      params:{
        page:1,
        size:10,
        key:''
      },
      // 存储请求的数据
      descriptionsConfigsKey: [],
      searchNum:0,
      // 存储得分与等级的转换
      level:{
        sScore:358,
        aScore:110,
        bScore:34,
        cScore:15
      },
      //评级转换图标
      iconLevel:"",
    }
  },
  methods:{
    keySearch(login){
      if(login!==''){
        this.searchNum++
      }
      searchByKey(this.params).then(res=>{
        if (res.code===200){
          this.descriptionsConfigsKey.push(res.data)
          console.log(this.descriptionsConfigsKey)
          for (let i = 0; i < this.descriptionsConfigsKey[this.params.page-1].length; i++) {
            // 对score的处理
            // this.levelList[(this.params.page-1)*this.params.size+index]
            if (this.descriptionsConfigsKey[this.searchNum-1][i].score>=this.level.sScore){
              this.descriptionsConfigsKey[this.searchNum-1][i].level='S'
              this.iconLevel='iconfont icon-S_square_solid'
            }else if(this.descriptionsConfigsKey[this.searchNum-1][i].score<this.level.sScore&&this.descriptionsConfigsKey[this.searchNum-1][i].score>=this.level.aScore){
              this.descriptionsConfigsKey[this.searchNum-1][i].level='A'
              this.iconLevel='iconfont icon-A_square_solid_4472c4'
            }else if(this.descriptionsConfigsKey[this.searchNum-1][i].score<this.level.aScore&&this.descriptionsConfigsKey[this.searchNum-1][i].score>=this.level.bScore){
              this.descriptionsConfigsKey[this.searchNum-1][i].level='B'
              this.iconLevel='iconfont icon-B_round_solid'
            }else if(this.descriptionsConfigsKey[this.searchNum-1][i].score<this.level.bScore&&this.descriptionsConfigsKey[this.searchNum-1][i].score>=this.level.cScore){
              this.descriptionsConfigsKey[this.searchNum-1][i].level='C'
              this.iconLevel='iconfont icon-C_square_solid'
            }else if (this.descriptionsConfigsKey[this.searchNum-1][i].score===null){
              this.descriptionsConfigsKey[this.searchNum-1][i].level='N/A'
              this.iconLevel='iconfont icon-999-weizhi'
            }else {
              this.descriptionsConfigsKey[this.searchNum-1][i].level='N/A'
              this.iconLevel='iconfont icon-999-weizhi'
            }
          }
        }
      })
    },
    handlePageChange (newPage) {
      this.params.page=newPage
      console.log(newPage)
      this.keySearch()
    }
  }
}
</script>

<style>
.rankBox {
  margin-left: 30px;
    .input{
      width: 600px;
      height: 40px;
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 80%;
      .el-input__icon:hover{
        cursor: pointer;
        font-size: 20px;
        color: black;
      }
    }
  .input:hover{
    width: 600px;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 80%;
    box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px;
    .el-input__icon:hover{
      cursor: pointer;
      font-size: 20px;
      color: black;
    }
  }
}
</style>