<template>
  <div class="container">
      <div class="add-input">
        <el-input v-model="this.params.login" placeholder="Please input user's login" style="width: 500px"></el-input>
      </div>
      <div class="add-button">
        <el-button @click="addByLogin">提交</el-button>
      </div>
  </div>
</template>

<script>
import {addUser} from "@/request/api.js";
import {ElMessage} from "element-plus";

export default {
  name: 'mAdd',
  data(){
    return{
      params:{
        login:''
      },
    }
  },
  methods: {
    addByLogin(){
      console.log(this.params.login)
      addUser(this.params).then(res=>{
        if (res.code===200){
          ElMessage({
            message: '添加成功.',
            type: 'success',
          })
        }else{
          ElMessage.error('添加失败，用户不存在.')
        }
      }).catch((error)=>{
        console.log(error)
        ElMessage.error('添加失败，用户不存在.')
      })
    }
  }

}
</script>

<style>
.container{
  width: 600px;
  height: 32px;
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  .add-input{
    display: flex;
  }
  .add-button{
    margin-left: 20px;
    display: flex;
  }
}
</style>