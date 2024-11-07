<template>
  <div class="container">
      <div  class="card">
        <div class="card-input">
          <el-input v-model="params.login"  placeholder="Please input user's login" class="input"/>
          <div class="button">
            <el-button @click="predictByInput" >搜索</el-button>
          </div>
        </div>
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <div>
          <pre class="card-content" v-if="isShow===true">
            {{this.text}}
          </pre>
          <div v-else><h3>请输入用户login，系统将为你查询用户信息</h3></div>
        </div>

      </div>
      <div ref="chart" class="echarts" style="width: 400px; height: 400px;"></div>
  </div>
</template>

<script>
import {getUserInfoNum, selectByName} from "@/request/api.js";
import * as echarts from 'echarts'

export default {
  name: 'userSelect',
  data(){
    return{
      // ByName select
      params:{
        login:"",
      },
      // ByName select
      readme:"",
      text:"",
      // 默认内容
      isShow:false,
      // 进度条
      progress: 0,
      timer: null,
      InfoFlag:0,
      // 柱状图数据
      chart: null,
      userInfoList:[],
      infoList:["仓库数量", "gist数量", "粉丝数","关注人数"],
      entriesNumList:[],
      entriesNum:[]
    }
  },
  mounted() {
    // 创建一个 ECharts 实例
    this.chart = echarts.init(this.$refs.chart)
    // 在 ECharts 实例中配置图表
    this.chart.setOption(this.getOption())
    // 获取该用户信息并更新

  },
  methods:{
    predictByInput(){
      console.log(this.params)
      getUserInfoNum(this.params).then(res=> {
        if (res.code===200){
          console.log("用户数据")
          console.log(res.data)
          this.entriesNumList.push(res.data.publicRepos)
          this.entriesNumList.push(res.data.publicGists)
          this.entriesNumList.push(res.data.following)
          console.log(this.entriesNumList)
        }
        // 构建数据
        for (let i=0;i<this.infoList.length;i++){
          let newObj={
            value:0,
            name:''
          }
          newObj.value=this.entriesNumList[i]
          newObj.name=this.infoList[i]
          this.entriesNum.push(newObj)
        }
        // 更新图表数据
        this.chart.setOption({
          series: [{
            data: this.entriesNum
          }]
        });
      })
      this.progress = 0;
      // 在这里设置一个异步的进度条setInterval，随着请求的时间，先按步长2来每秒增加进度条，如果请求到了数据，即请求标志位为1了，直接拉满
      this.startProgressBar();
      selectByName(this.params).then(res=>{
        if (res.code===200) {
          this.InfoFlag=1
          this.isShow=true
          this.stopProgressBar();
          console.log(res.data)
          this.text=res.data
          // this.changeRow()
        }
      }).catch(error => {
        this.stopProgressBar();
        // 处理错误
      });
    },
    startProgressBar() {
      this.timer = setInterval(() => {
        if (this.progress < 100) {
          if (this.InfoFlag===1){
            console.log(this.InfoFlag)
            this.progress=100
          }
          this.progress += 0.02; // 这里简单地每秒增加10%的进度
        } else if(this.InfoFlag===1){
          this.stopProgressBar();
        }
      }, 10); // 每0.01秒更新一次进度
    },
    stopProgressBar() {
      clearInterval(this.timer);
      if (this.InfoFlag===1){
        this.progress=0
      }
      this.InfoFlag=0 // 重置
      //this.progress = 100; // 确保进度条达到100%
    },
    // 处理柱状图数据
    getOption() {
      return {
        // 这里是你的 ECharts 配置项
        title: {
          text: "GitGuru数据分析",
          textStyle: {
            // color: "pink", // 标题颜色
            fontSize: 14, // 默认值：18
            fontStyle: "normal", // normal:正常风格（默认值）,italic:倾斜体
            fontWeight: "bold" // normal:正常粗细（默认值）,bold/bolder:粗体,lighter:正常粗细
          },
          subtext: "用户属性"
        },
        grid: {
          left: "40px",
          right: "10px",
          bottom: "30px"
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false,
            length: 15 // 竖线的长度
          },
          data: ["仓库数量", "gist数量","关注人数"]
        },
        yAxis: {
          axisLabel: {
            show: true
          }
        },
        series: [
          {
            name: "访问来源",
            type: "bar", // 设置图表类型为柱状
            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              { value: 235, name: "仓库数量" },
              { value: 274, name: "gist数量" },
              { value: 310, name: "关注人数" }

            ]
          }
        ]
      }
    }
  },
}
</script>
<style>
.container{
  width: 1000px;
  .card{
    width: 600px;
    height: 100%;
    margin-left: 20px;
    padding: 0;

    .card-input{
      width: 100%;
      display: flex;
      height: 60px;
      box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
      .input{
        display: flex;
        width: 500px;
        margin-top: 10px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .button{
        display: flex;
        margin-left: 10px;
        margin-top: 12px;
        margin-right: 3px;
        margin-bottom: 10px;
      }
    }
    .card-content{
      width: 100%;
      height: 500px;
      font-size:14px ;
      color: black;
      font-family: "Arial", "Helvetica", sans-serif; /* 设置字体类型 */
      overflow: scroll;

    }
    .progress-bar {
      height: 2px;
      background-color: #4caf50;
      transition: width 0.5s;
    }
  }
  .echarts{
    margin-left: 200px;
    margin-top: 50px;
  }
}

</style>