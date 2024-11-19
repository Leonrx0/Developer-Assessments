<template>
<!--    输入框-->
  <div class="card-input">
    <el-input v-model="params.login"  placeholder="Please input user's login" class="input">
      <template #suffix>
        <el-icon class="el-input__icon" @click="predictByInput"><Search /></el-icon>
      </template>
    </el-input>
  </div>
<!--    用户信息框-->
  <el-card class="userInfo">
    <el-descriptions
        title="用户信息"
        direction="vertical"
        border
        style="margin-top: 10px"
    >
      <el-descriptions-item
          :rowspan="2"
          :width="140"
          label="Photo"
          align="center"
      >
        <el-image
            style="width: 100px; height: 100px"
            :src=this.photo
        />
      </el-descriptions-item>
      <el-descriptions-item label="Username">{{this.userInfoItem.get('username')}}</el-descriptions-item>
      <el-descriptions-item label="Email">{{this.userInfoItem.get('email')}}</el-descriptions-item>
      <el-descriptions-item label="Score">{{this.userInfoItem.get('score')}}</el-descriptions-item>
      <el-descriptions-item label="Address">
        {{this.userInfoItem.get('location')}}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
  <!--    数据分析框-->
  <div class="userTitle"><h3>数据分析</h3></div>
  <el-card class="chartsInfo">
    <div ref="chart" class="echarts" style="width: 400px; height: 400px;"></div>
  </el-card>
<!--    文档分析框-->
  <div class="userTitle"><h3>技术分析</h3></div>
  <el-card class="readmeInfo">
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    <div>
          <pre class="card-content" v-if="isShow===true">
            {{this.text}}
          </pre>
      <div v-else>
        <h3 v-if="!isShowText">用户的Readme文档分析</h3>
        <h3 v-else>用户的Readme文档正在分析中，这个过程可能需要一段时间，请稍等······</h3>
      </div>
    </div>
  </el-card>
</template>

<script>
import {getUserInfoNum, selectByName} from "@/request/api.js";
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

export default {
  name: 'userSelect',
  components: {Search},
  computed: {
    Search() {
      return Search
    }
  },
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
      isShowText:false,
      // 进度条
      progress: 0,
      timer: null,
      InfoFlag:0,
      // 柱状图数据
      chart: null,
      userInfoList:[],
      infoList:["仓库数量", "gist数量", "粉丝数","关注人数"],
      entriesNumList:[],
      entriesNum:[],
      // 用户信息
      userInfoItem:new Map(),
      photo:''
    }
  },
  mounted() {
    // 给map赋初值
    this.userInfoItem.set('email','等待查询')
    this.userInfoItem.set('score',0)
    this.userInfoItem.set('location','等待查询')
    this.userInfoItem.set('username','等待查询')
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
          // 用户数据
          // this.userInfoItem.set('avatarUrl',res.data.avatarUrl)
          this.photo = res.data.avatarUrl
          this.userInfoItem.set('email',res.data.email)
          this.userInfoItem.set('score',res.data.score)
          this.userInfoItem.set('location',res.data.location)
          this.userInfoItem.set('username',res.data.name)
          console.log(this.userInfoItem)
          // 统计图数据
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
      this.isShowText = true;
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
        if (this.progress < 200) {
          if (this.InfoFlag===1){
            console.log(this.InfoFlag)
            this.progress=200
          }
          this.progress += 0.03; // 这里简单地每秒增加10%的进度
        } else if(this.InfoFlag===1){
          this.progress=200
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
    .card-input{
      width: 100%;
      height: 70px;
      margin-left: 20px;
      /*box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;*/
      .input{
        width: 500px;
        height: 40px;
        margin-top: 10px;
        margin-bottom: 10px;
        .el-input__icon:hover{
          cursor: pointer;
          font-size: 20px;
          color: black;
        }
      }
    }
  .readmeInfo{
    margin-top: 10px;
    margin-left: 20px;
    width: 70%;
    height: 500px;
    overflow: scroll;
    .progress-bar {
      height: 2px;
      background-color: lightskyblue;
      transition: width 0.5s;
      margin-top:0;
    }
    .card-content{
      width: 100%;
      height: 500px;
      font-size:14px ;
      color: black;
      font-family: "Arial", "Helvetica", sans-serif; /* 设置字体类型 */
      overflow: scroll;

    }
  }
  .userInfo{
    margin-top: 10px;
    margin-left: 20px;
    background-color: #4caf50;
    width: 70%;
    height: 300px;
  }
  .chartsInfo{
    width: 70%;
    margin-top: 10px;
    margin-left: 20px;
    background-color: red;

  }
  .userTitle{
    margin-left: 20px;
    font-size: 30px;
  }


</style>