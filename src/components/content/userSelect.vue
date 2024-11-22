<template>
  <div class="all" style="display: flex">
    <div class="left" style="width: 70%;height: 100%;">
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
        <div class="chartBox">
          <div ref="chart" class="echarts" style="width: 500px; height: 400px;"></div>
          <div class="scoreBox" >
            <div class="scoreTitle"><h3>用户得分所处在的阶段是前{{this.percentagePosition}}</h3></div>
            <div class="score_position">
              <el-popover
                  :visible=this.positionFlag_N
                  placement="left"
                  :width="200"
              >
                <el-avatar :size="50" :src=this.photo />
                <div style="width: 60px;height: 30px;">{{this.userInfoItem.get('username')}}</div>
                <template #reference>
                  <div class="N_length">N/A</div>
                </template>
              </el-popover>
              <el-popover
                  :visible=this.positionFlag_C
                  placement="left"
                  :width="200"
              >
                <el-avatar :size="50" :src=this.photo />
                <div style="width: 60px;height: 30px">{{this.userInfoItem.get('username')}}</div>
                <template #reference>
                  <div class="C_length">C</div>
                </template>
              </el-popover>
              <el-popover
                  :visible=this.positionFlag_B
                  placement="left"
                  :width="200"
              >
                <el-avatar :size="50" :src=this.photo />
                <div style="width: 60px;height: 30px">{{this.userInfoItem.get('username')}}</div>
                <template #reference>
                  <div class="B_length">B</div>
                </template>
              </el-popover>
              <el-popover
                  :visible=this.positionFlag_A
                  placement="left"
                  :width="200"
              >
                <el-avatar :size="50" :src=this.photo />
                <div style="width: 60px;height: 30px">{{this.userInfoItem.get('username')}}</div>
                <template #reference>
                  <div class="A_length">A</div>
                </template>
              </el-popover>
              <el-popover
                  :visible=this.positionFlag_S
                  placement="left"
                  :width="90"
              >
                <el-avatar :size="70" :src=this.photo style="margin-left: 25px"/>
                <div style="width: 70px;height: 30px;margin-left: 25px;margin-top: 5px">{{this.userInfoItem.get('username')}}</div>
                <template #reference>
                  <div class="S_length">S</div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
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
    </div>
    <div class="right" style="width: 30%;height: 100%;margin-top:4.5%;margin-left: -30px">
      <el-card>
        <div style="margin-bottom: 10px"><h3>项目历程：</h3></div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item
              placement="top"
              v-for="(item, index) in historyRepoItems_sort[0]"
              :key="index"
              :timestamp="item.updateTime">
            <el-card>
              <h3>项目名称：<span style="font-size: 13px;font-weight: normal;">{{item.name}}</span></h3>
              <h3>项目介绍：<span style="font-size: 13px;font-weight: normal;">{{item.description}}</span></h3>
              <h3>项目地址：<span style="font-size: 13px;font-weight: normal;">{{item.cloneUrl}}</span></h3>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>

</template>

<script>
import {getUserInfoNum, getUserRepo, selectByName} from "@/request/api.js";
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
      photo:'',
      // 数据统计位置显示
      level:{
        sScore:358,
        aScore:110,
        bScore:34,
        cScore:15
      },
      userPosition:'',
      positionFlag_N:false,
      positionFlag_C:false,
      positionFlag_B:false,
      positionFlag_A:false,
      positionFlag_S:false,
      percentagePosition:'N/A',

      // 仓库记录
      historyRepoItems:[],
      historyRepoItems_sort:[],
      timeList:[]
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
          // console.log(res.data)
          // getUserRepo(this.params).then((res)=>{
          //   if (res.code===200){
          //     console.log(1)
          //     console.log(res.data)
          //   }
          // })
          // 得分位置
          this.judgePosition(res.data.score)
          // 用户数据
          this.photo = res.data.avatarUrl
          this.userInfoItem.set('email',res.data.email)
          this.userInfoItem.set('score',res.data.score)
          this.userInfoItem.set('location',res.data.location)
          this.userInfoItem.set('username',res.data.name)
          if (this.userInfoItem.get('username')===''){
            this.userInfoItem.set('username','用户未填写')
          }
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
      this.getUserHistoryRepos()
      this.progress = 0;
      // 在这里设置一个异步的进度条setInterval，随着请求的时间，先按步长2来每秒增加进度条，如果请求到了数据，即请求标志位为1了，直接拉满
      this.startProgressBar();
      this.isShowText = true;
      selectByName(this.params).then(res=>{
        if (res.code===200) {
          this.InfoFlag=1
          this.isShow=true
          this.stopProgressBar();
          // console.log(res.data)
          this.text = res.data.replace(/\*/g, '')
          // console.log("改变之后的为：")
          // console.log(this.text)

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
    },
    // 判断分数并给位置
    judgePosition(data){
      if (data>=this.level.sScore){
        this.userPosition='S'
        this.percentagePosition='1%'
        this.positionFlag_S=true
      }else if(data.score<this.level.sScore&&data>=this.level.aScore){
        this.userPosition='A'
        this.percentagePosition='10%'
        this.positionFlag_A=true
      }else if(data.score<this.level.aScore&&data>=this.level.bScore){
        this.userPosition='B'
        this.percentagePosition='30%'
        this.positionFlag_B=true
      }else if(data.score<this.level.bScore&&data>=this.level.cScore){
        this.userPosition='C'
        this.percentagePosition='70%'
        this.positionFlag_C=true
      }else {
        this.userPosition='N/A'
        this.percentagePosition='70%以后'
        this.positionFlag_N=true
      }
    },
    // 对时间线进行快排
    // quickSort(arr) {
    //   // 选择中间元素作为基准值
    //   let pivot = arr[Math.floor(arr.length / 2)];
    //   let left = []; // 存储比基准值大的元素（降序）
    //   let right = []; // 存储比基准值小或等于的元素（降序）
    //
    //   for (let i = 0; i < arr.length; i++) {
    //     if (i === Math.floor(arr.length / 2)) continue;
    //     if (arr[i].updatedAt > pivot.updatedAt) {
    //       left.push(arr[i]); // 比基准值大的元素放入left数组（降序）
    //     } else {
    //       right.push(arr[i]); // 比基准值小或等于的元素放入right数组（降序）
    //     }
    //   }
    //   return this.quickSort(left).concat([pivot], this.quickSort(right));
    // },
    getUserHistoryRepos(){
      getUserRepo(this.params).then((res)=>{
        if (res.code===200){
          console.log(res.data)
          for(let i=0;i<6;i++){
            // 构建数据
            let reposInfo={
              name:'',
              description:'',
              updateTime:'',
              cloneUrl:''
            }
            reposInfo.name=res.data[i].name
            reposInfo.description=res.data[i].description
            reposInfo.updateTime=res.data[i].updatedAt
            reposInfo.cloneUrl=res.data[i].clone_url
            this.historyRepoItems.push(reposInfo)
          }
          // 这是冒泡
          // for (let i = 0; i < 6; i++) {
          //   // 标志位，用于优化算法，如果在某一趟排序中没有发生交换，则说明数组已经有序，可以提前退出
          //   let swapped = false;
          //   for (let j = 0; j < 6 - i; j++) {
          //     if (this.historyRepoItems[j].updateTime < this.historyRepoItems[j + 1].updateTime) {
          //       // 交换元素
          //       [this.historyRepoItems[j], this.historyRepoItems[j + 1]] = [this.historyRepoItems[j + 1], this.historyRepoItems[j]];
          //       swapped = true;
          //     }
          //   }
          //   // 如果某一趟排序没有发生交换，说明数组已经有序，提前退出
          //   if (!swapped) {
          //     break;
          //   }
          // }
          console.log(this.historyRepoItems.length)
          this.historyRepoItems_sort.push(this.quickSort(this.historyRepoItems))
          console.log(this.historyRepoItems_sort[0])
        }
      })
    },
    quickSort(arr) {
      console.log("arr:")
      console.log(arr)
      // 选择中间元素作为基准值
      if (arr.length <= 1) {
        return arr;
      }

      let pivot = arr[Math.floor(arr.length / 2)];
      let left = []; // 存储比基准值大的元素（降序）
      let right = []; // 存储比基准值小或等于的元素（降序）

      for (let i = 0; i < arr.length; i++) {
        if (i === Math.floor(arr.length / 2)) continue;
        if (arr[i].updateTime > pivot.updateTime) {
          left.push(arr[i]); // 比基准值大的元素放入left数组（降序）
        } else {
          right.push(arr[i]); // 比基准值小或等于的元素放入right数组（降序）
        }
      }

      return this.quickSort(left).concat([pivot], this.quickSort(right));
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
    width: 90%;
    height: 500px;
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
    width: 90%;
    height: 300px;
  }
  .chartsInfo{
    width: 90%;
    margin-top: 10px;
    margin-left: 20px;
    .chartBox{
      width: 100%;
      display: flex;
      .scoreBox{
        width: 50%;
        height: 400px;
        margin-left: 200px;
        .scoreTitle{
          font-size: 20px;

        }
        .score_position{
          width: 100%;
          margin-top:10%;
          margin-left: 10%;
          height: 30px;
          /*display: flex;*/
          color: white;
          .N_length{
            width: 25%;
            line-height: 40px;
            text-align: center;
            font-size: 18px;
            height:40px;
            background-color: #D8BFD8;
          }
          .N_length:hover{
            width: 25%;
            font-size: 22px;
            line-height: 40px;
            text-align: center;
            height:40px;
            background-color: #D8BFD8;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
          }

          .C_length{
            width: 35%;
            height:40px;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            background-color: #BA55D3;
          }
          .C_length:hover{
            width: 35%;
            height:40px;
            font-size: 22px;
            line-height: 40px;
            text-align: center;
            background-color: #BA55D3;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
          }
          .B_length{
            width: 20%;
            height:40px;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            background-color: #9932CC;
          }
          .B_length:hover{
            width: 20%;
            height:40px;
            font-size: 22px;
            line-height: 40px;
            text-align: center;
            background-color: #9932CC;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
           }
          .A_length{
            width: 14%;
            height:40px;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            background-color: #9400D3;
          }
          .A_length:hover{
            width: 14%;
            height:40px;
            font-size: 22px;
            line-height: 40px;
            text-align: center;
            background-color: #9400D3;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
          }
          .S_length{
            width: 6%;
            height:40px;
            font-size: 18px;
            line-height: 40px;
            text-align: center;
            background-color: #800080;
          }
          .S_length:hover{
            width: 6%;
            height:40px;
            font-size: 22px;
            line-height: 40px;
            text-align: center;
            background-color: #800080;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
          }
        }
      }

    }
  }
  .userTitle{
    margin-left: 20px;
    font-size: 30px;
  }


</style>