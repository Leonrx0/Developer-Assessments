<template>
  <div class="container">
      <div  class="card">
        <div class="card-input">
          <el-input v-model="params.login"  placeholder="Please input username" class="input"/>
          <div class="button">
            <el-button @click="predictByInput" >搜索</el-button>
          </div>
        </div>
<!--        进度条-->
        <div class="progress-bar" :style="{ width: progress + '%' }">

        </div>
        <pre class="card-content">
          {{this.text}}
        </pre>
      </div>
  </div>
</template>

<script>
import {selectByName} from "@/request/api.js";

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
      // 进度条
      progress: 0,
      timer: null,
      InfoFlag:0
    }
  },
  methods:{
    predictByInput(){
      console.log(this.params)
      this.progress = 0;
      // 在这里设置一个异步的进度条setInterval，随着请求的时间，先按步长2来每秒增加进度条，如果请求到了数据，即请求标志位为1了，直接拉满
      this.startProgressBar();
      selectByName(this.params).then(res=>{
        if (res.code===200) {
          this.InfoFlag=1
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
    // 字符处理
    // changeRow(){
    //   this.readme = this.text.replace(/\n\n/g, "<br>"); // 将所有\n替换为<br>
    //   document.getElementById("someElementId").innerHTML = this.readme;
    // }
  },
}
</script>
<style>
.container{
  width: 1000px;
  height: 90%;
  .card{
    width: 100%;
    height: 100%;
    margin-left: 20px;
    padding: 0;
    box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
    .card-input{
      display: flex;
      height: 60px;
      box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;
      .input{
        display: flex;
        width: 300px;
        margin-top: 10px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .button{
        display: flex;
        margin-left: 10px;
        margin-top: 12px;
        margin-bottom: 10px;
      }
    }
    .card-content{
      height: 90%;
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
}

</style>