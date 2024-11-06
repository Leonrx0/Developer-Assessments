<template>  
  <div class="rankBox">
    <el-pagination
        layout="prev, pager, next, jumper, total"
        :page-size="this.params.size"
        :total="100"
        v-model:current-page="this.params.page"
        @current-change="handlePageChange"
    />
    <el-descriptions class="description" direction="vertical" border v-for="(item,index) in descriptionsConfigs[this.params.page-1]" :key="index" :title="'No.'+(this.params.size*(this.params.page-1)+index+1)" >
      <el-descriptions-item label="UserName" width="250px">{{item.name}}</el-descriptions-item>
      <el-descriptions-item label="EMail" width="250px">{{item.email}}</el-descriptions-item>
      <el-descriptions-item label="Github" width="250px">{{item.html_url}}</el-descriptions-item>
      <el-descriptions-item label="Level" width="250px">{{item.level}}</el-descriptions-item>
      <el-descriptions-item label="Nation" width="250px">
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
      <el-descriptions-item label="Field" width="250px">{{item.topic}}</el-descriptions-item>
    </el-descriptions>
  </div>
  <div class="other-box">
    <div class="rules">
      <el-card class="rules-card">
        <h2>技术排名:</h2>
        <h3>我们通过用户的score得分来进行用户排名</h3>
        <h4>1.对用户的UserName，Nation，Field，Email，Github_url进行展示和介绍</h4>
        <h4>2.预测结果，若返回结果为N/A，说明置信度不高，不可作为推断依据，如果置信度够高，那么将会返回预测的用户所在地，并给出推断理由</h4>
      </el-card>
    </div>
    <div ref="chart" class="echarts" style="width: 400px; height: 400px;"></div>
  </div>
</template>  
  
<script >

import {getRankList, predictByName, classifyLever, getEchartsData} from '@/request/api'
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
      levelName:['S', 'A', 'B', 'C', 'N/A'],
      sNumList:[],
      chartData: {
        // 这里是你要绘制的饼图数据
      },
      chartsData:[]


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
    // 获取各分段人数并更新
    getEchartsData().then(res=>{
      if (res.code===200){
        console.log(res.data)
        this.chartData=res.data
      }
      this.sNumList.push(this.chartData.sSize)
      this.sNumList.push(this.chartData.aSize)
      this.sNumList.push(this.chartData.bSize)
      this.sNumList.push(this.chartData.cSize)
      this.sNumList.push(this.chartData.dSize)
      console.log(this.sNumList)
      // 构建数据
      for (let i=0;i<this.levelName.length;i++){
        let newObj={
          value:0,
          name:''
        }
        newObj.value=this.sNumList[i]
        newObj.name=this.levelName[i]
        this.chartsData.push(newObj)
      }
      console.log(this.chartsData)


      // 更新图表数据
      this.chart.setOption({
        series: [{
          data: this.chartsData
        }]
      });
    })
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
          text: 'Github数据分析',
          subtext: '各分段人数饼状图',
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
              {value: 1312, name: 'S'},
              {value: 55, name: 'A'},
              {value: 54, name: 'B'},
              {value: 555, name: 'C'},
              {value: 111, name: 'N/A'}
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
  position: fixed;
  margin-top: 20px;
  margin-left: 1000px;
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