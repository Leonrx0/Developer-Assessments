<template>
    <div class="dBOX">
      <div class="default">
        <div class="limit">
          <div class="limit-title">获取数据:</div>
          <div class="limit-radios">
            <el-radio-group v-model="radio">
              <el-radio label="1" size="large">50</el-radio>
              <el-radio label="2" size="large">100</el-radio>
              <el-radio label="3" size="large">200</el-radio>
              <el-radio label="4" size="large">300</el-radio>
            </el-radio-group>
          </div>
          <div class="button">
            <el-button @click="summit" :disabled="isDisabled">
              提交
            </el-button>
          </div>
        </div>
        <div class="content">
          <h1>这是一个基于Github上的用户数据制作的一个数据分析网站，以下是功能介绍:</h1>
          <h2>1.技术排名:</h2>
          <h3>&nbsp;&nbsp;&nbsp;&nbsp;我们通过用户的score得分来进行用户排名</h3>
          <h2>2.用户查询:</h2>
          <h3>&nbsp;&nbsp;&nbsp;&nbsp;通过对用户的login进行查询，可以得到用户的项目介绍</h3>
          <h2>3.添加用户:</h2>
          <h3>&nbsp;&nbsp;&nbsp;&nbsp;我们对Github上有，但是本系统未获得的用户进行添加</h3>
          <h2>4.关键字搜索:</h2>
          <h3>&nbsp;&nbsp;&nbsp;&nbsp;我们可以通过一些关键字，如国家或者领域来显示满足要求的用户</h3>
        </div>
      </div>
    </div>
</template>
  
<script>
import {limitLoad} from "@/request/api.js";
import {ElMessage} from "element-plus";

export default {
  name: 'mDefault',
  data(){
    return{
      radio:'',
      params:{
        num:0
      },
      isDisabled:false,
      // 存储setTimeout返回的ID，以便可以清除它
      disableTimeout: null,
    }
  },
  methods:{
    summit(){
      // 先对数据进行修改
      this.params.num=Number(this.radio)
      limitLoad(this.params).then(res=>{
        if (res.code===200){
          ElMessage({
            message: '提交成功.',
            type: 'success',
          })
          // 一小时后重新启用
          this.isDisabled=true
          this.disableTimeout = setTimeout(() => {
            this.isDisabled = false;
          }, 3600000); // 3600000毫秒等于一小时

        }
      })
    }
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器，防止内存泄漏
    if (this.disableTimeout) {
      clearTimeout(this.disableTimeout);
    }
  },

}
</script>
  
<style>
.dBOX{
  height: 600px;
  width: 900px;
  margin-left: 20px;
  //margin-top: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  .default{
    margin-left: 20px;
    .limit{
      height: 50px;
      display: flex;
      .limit-title{
        margin-left: 10px;
        margin-top: 12px;
        margin-right: 10px;
        display: block;
      }
      .limit-radios{
        display: flex;
      }
      .button{
        margin-top: 10px;
        margin-left: 30px;
        display: flex;
      }
    }
    .content{
      margin-top: 10px;
    }
  }
}
</style>