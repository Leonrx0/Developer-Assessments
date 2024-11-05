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
        <div v-if="item.location!==null">{{item.location}}</div>
        <el-button v-else @click="predictByNull(index)">
          预测
        </el-button>
        <el-dialog v-if="ShowDialog" class="predDialog" :before-close="handleClose">
          <div class="Text">
            <pre>
              {{this.predNation}}
            </pre>
          </div>

        </el-dialog>
      </el-descriptions-item>
      <el-descriptions-item label="Field" width="100px">{{item.topic}}</el-descriptions-item>
    </el-descriptions>
  </div>
  <div class="other-box">
    <div class="rules">
      <el-card class="rules-card">
        this is hat
<!--        <h2>技术排名:</h2>-->
<!--        <h3>&nbsp;&nbsp;&nbsp;&nbsp;我们通过用户的score得分来进行用户排名</h3>-->
<!--        <h3>&nbsp;&nbsp;&nbsp;&nbsp;bi</h3>-->
      </el-card>
    </div>
    <div ref="chart" class="echarts" style="width: 400px; height: 400px;"></div>
  </div>
</template>  
  
<script >

import {getRankList, predictByName,classifyLever} from '@/request/api'
import { ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
export default {
  name: 'mRank',
  data() {
    return {
      // 分页功能
      params: {
        page: 1,
        size: 10
      },
      // 是否显示对话框
      ShowDialog:false,
      predNation:"",
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
      preName:{
       login:''
      },
      test:{
        login: 'jmalarcon'
      },
      testNation:'',
      preRes:false,
      // 饼状图分析
      chart: null,
      chartData: {
        // 这里是你要绘制的饼图数据
      }


    };
  },
  computed:{
    // 对topic进行处理
  },
  mounted() {
    this.getInfo()
    // 创建一个 ECharts 实例
    this.chart = echarts.init(this.$refs.chart)
    // 在 ECharts 实例中配置图表
    this.chart.setOption(this.getOption())
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
                this.predNation=res.data.userLocations
                this.ShowDialog=true
                // ElMessageBox.alert(res.data.userLocations, '预测', {
                //   confirmButtonText: '确定',
                //   callback: action => {
                //     console.log(action);
                //   }
                // });
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
    },
    predictByNullTest(){
      console.log(1)
      predictByName(this.test).then(res => {
        if (res.code === 200) {
          if (res.data.userLocations!=='N/A'){
            this.testNation=res.data.userLocations
            console.log(this.testNation)
            this.ShowDialog=true
            // ElMessageBox.alert(res.data.userLocations, '预测', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     console.log(action);
            //   }
            // });
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
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    // 处理饼状图数据
    getOption() {
      return {
        // 这里是你的 ECharts 配置项
        title: {
          text: '饼图标题',
          subtext: '饼图副标题',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['S', 'A', 'B', 'C', 'N/A']
        },
        series: [
          {
            name: '评级饼状图',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 335, name: 'S'},
              {value: 310, name: 'A'},
              {value: 234, name: 'B'},
              {value: 135, name: 'C'},
              {value: 1548, name: 'N/A'}
            ]
          }
        ]
      }
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
    .predDialog{
      .Text{
        --el-dialog-width: 90%;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
  }
}
.other-box{
  margin-top: 20px;
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
  .echarts{
    margin-left: 100px;
    margin-top: 50px;
  }
}

.descriptionTest{
  .predDialogTest{
    --el-dialog-width: 90%;
    word-break: break-all;
    word-wrap: break-word;
  }
}

/* // photo: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", */
</style>