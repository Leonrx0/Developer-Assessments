<template>  
  <div class="rankBox">
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
<!--        <el-button v-if="item.location===null" @click="predictByNull(index)">-->
<!--          预测-->
<!--          <div class="nation" v-if="this.predArray[this.scriptMap.get(index)].preNation!=='N/A'">-->
<!--            (预测值: {{ this.predArray[this.scriptMap.get(index)].preNation }})-->
<!--          </div>-->
<!--          <div class="nation" v-else>-->
<!--            <span>当前数据量不足，预测可信度不高</span>-->
<!--          </div>-->
<!--        </el-button>-->
<!--        <div v-else>{{item.location}}</div>-->
        <div v-if="item.location!==null">{{item.location}}</div>
        <el-button v-else @click="predictByNull(index)">
          预测
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item label="Field" width="100px">{{item.topic}}</el-descriptions-item>
    </el-descriptions>
  </div>
  <div class="rules">
    <el-card class="rules-card">
        this is a hat
    </el-card>
  </div>
</template>  
  
<script >

import {getRankList, predictByName,classifyLever} from '@/request/api'
import { ElMessageBox } from 'element-plus'


export default {
  name: 'mRank',
  data() {
    return {
      // 分页功能
      params: {
        page: 1,
        size: 10
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
      // 是否显示按钮
      IsPredicted: true,
      // 存储location为null的login与i进行预测
      predArray: [],
      preName:{
       login:''
      },
      preRes:false
      // 内容标签对齐
    };
  },
  computed:{
    // 对topic进行处理
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取数据并且存储
    getInfo() {
      console.log("开始调用")
      console.log((this.params))
      getRankList(this.params).then(res => {
        this.descriptionsConfigs.push(res.data)
        // console.log("descriptionsConfigs为：")
        // console.log(this.descriptionsConfigs[this.params.page-1])
        for (let i = 0; i < 10; i++) {
          if (this.descriptionsConfigs[0][i].location === null) {
            this.IsPredicted = true
          }
          // 对score的处理
          // this.levelList[(this.params.page-1)*this.params.size+index
          if (this.descriptionsConfigs[this.params.page-1][i].score>=this.level.sScore){
            this.descriptionsConfigs[this.params.page-1][i].level='S'
          }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.sScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.aScore){
            this.descriptionsConfigs[this.params.page-1][i].level='A'
          }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.aScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.bScore){
            this.descriptionsConfigs[this.params.page-1][i].level='B'
          }else if(this.descriptionsConfigs[this.params.page-1][i].score<this.level.bScore&&this.descriptionsConfigs[this.params.page-1][i].score>=this.level.cScore){
            this.descriptionsConfigs[this.params.page-1][i].level='C'
          }else {
            this.descriptionsConfigs[this.params.page-1][i].level='N/A'
          }
          // console.log(this.levelList)
        }
      })
    },
    predictByNull(index) {
      //获得对应的username
      this.preName.login=this.descriptionsConfigs[0][index].login
      console.log(this.descriptionsConfigs[0][index].userLocation)
      predictByName(this.preName).then(res => {
        if (res.code === 200) {
              if (res.data.userLocations!=='N/A'){
                ElMessageBox.alert(res.data.userLocations, '预测', {
                  confirmButtonText: '确定',
                  callback: action => {
                    console.log(action);
                  }
                });
              }
              else{
                ElMessageBox.alert("当前数据量不足，预测可信度不高", '预测', {
                  confirmButtonText: '确定',
                  callback: action => {
                    console.log(action);
                  }
                });
              }
              this.preRes=true
        }
      })

    },
    handlePageChange (newPage) {
      // console.log('当前页码改变为：', newPage);
      this.params.page=newPage
      // console.log(this.params)
      // console.log("更新------------")
      this.getInfo()
    }


  }
}
</script>
  
<style>
.rankBox{
  margin-left: 30px;
  .description{
    margin-bottom: 10px;
    .nation{
      display: inline;
    }
  }
}
.rules{
  display: flex;
  margin-left: 100px;
  margin-top: 30px;
  height: 300px;
  width: 400px;
  .rules-card{
    height: 100%;
    width: 100%;
  }
}

/* // photo: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", */
</style>