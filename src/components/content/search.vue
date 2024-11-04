<template>
  <div class="rankBox">
    <div  class="card-input">
      <input v-model="params.key"  placeholder="Please input Keywords" class="input"/>
      <div class="button" @click="keySearch">
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
      <el-descriptions class="description" border v-for="(item,index) in descriptionsConfigs[this.params.page-1]" :key="index" :title="'No.'+(index+1)" >
        <el-descriptions-item label="UserName" width="100px">{{item.name}}</el-descriptions-item>
        <el-descriptions-item label="EMail" width="150px">{{item.email}}</el-descriptions-item>
        <el-descriptions-item label="Github" width="150px">{{item.html_url}}</el-descriptions-item>
        <el-descriptions-item label="Level" width="100px">{{item.level}}</el-descriptions-item>
        <el-descriptions-item label="Nation" >
          <div v-if="item.location!==null">{{item.location}}</div>
          <el-button v-else @click="predictByNull(index)">
            预测
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="Field" width="100px">{{item.topic}}</el-descriptions-item>
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
      descriptionsConfigs: [],
      // 存储得分与等级的转换
      level:{
        sScore:358,
        aScore:110,
        bScore:34,
        cScore:15
      },
    }
  },
  methods:{
    keySearch(){
      searchByKey(this.params).then(res=>{
        if (res.code===200){
          this.descriptionsConfigs.push(res.data)
          for (let i = 0; i < this.descriptionsConfigs[0].length; i++) {
            // 对score的处理
            // this.levelList[(this.params.page-1)*this.params.size+index]
            if (this.descriptionsConfigs[this.params.page-1][i].score>=this.level.sScore){
              console.log(1)
              this.descriptionsConfigs[this.params.page-1][i].level='S'
            }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.sScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.aScore){
              console.log(2)
              this.descriptionsConfigs[this.params.page-1][i].level='A'
            }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.aScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.bScore){
              console.log(3)
              this.descriptionsConfigs[this.params.page-1][i].level='B'
            }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.bScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.cScore){
              console.log(4)
              this.descriptionsConfigs[this.params.page-1][i].level='C'
            }else if (this.descriptionsConfigs[this.params.page-1][i].score===null){
              console.log(5)
              this.descriptionsConfigs[this.params.page-1][i].level='N/A'
            }else {
              this.descriptionsConfigs[this.params.page-1][i].level='N/A'
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
    height: 40px;
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
    margin-top: 20px;
  }
}
</style>