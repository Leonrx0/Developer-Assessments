<template>
  <div class="rankBox">
    <div  class="card-input">
      <input v-model="params.key"  placeholder="Please input Keywords" class="input"/>
      <div class="button" @click="keySearch(this.params.key)">
        <div class="sousuo">
          <i class="iconfont icon-sousuo"></i>
        </div>
      </div>
    </div>
    <div class="content">
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
  </div>
</template>

<script >

import {searchByKey} from '@/request/api'
import "@/assets/iconfont/icon/iconfont.css"

export default {
  name: 'mSearch',
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
  .card-input {
    display: flex;
    height: 5px;
    width:400px;
    border-radius: 25px;
    .input{
      display: flex;
      border-radius: 25px 0 0 25px;
      height: 40px;
      width: 400px;
      border: 1px solid #000;
      border-right-style:none ;
    }
    .button{
      display: flex;
      height: 42px;
      width: 50px;
      background-color: #409eff;
      border-radius: 0 25px 25px 0;
      border: 1px solid #000;
      .sousuo{
        margin-left: 8px;
        margin-top: 10px;
      }
    }
  }
  .content{
  }
}
</style>