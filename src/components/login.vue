<template>
  <div class="back">
    <div class="blur_box">
      <div class="login">
        <div class="login-card">
          <div class="title-container"> <h3 class="title">用户登录</h3> </div>  <!-- 标题 -->
          <div class="form-container">
            <el-form class="login-form">
              <el-form-item prop="username" class="form-item">
                <div class="input-title">账户:&nbsp;&nbsp;<el-input placeholder="username" name="username" type="text" v-model="loginForm.name" class="input-content"/></div>
              </el-form-item>
              <el-form-item prop="password" class="form-item">
                <div class="input-title">密码:&nbsp;&nbsp;<el-input placeholder="password" name="password" v-model="loginForm.password" class="input-content"/> </div>
              </el-form-item>
              <el-button type="primary" style="width: 20%; margin-bottom: 30px" @click="handleLogin" class="form-button">登录</el-button>
              <el-button type="primary" style="width: 20%; margin-bottom: 30px" @click="handleRegister" class="form-button">注册</el-button>
              <el-dialog
                  title="注册"
                  v-model="visible"
                  width="30%"
                  height="300px"
                  @close="handleClose"
                  class="dialog"
              >
                <el-form  class="register-box">
                  <el-form-item prop="username" class="register-item">
                    <div class="register-title">账户:<el-input v-model="registerForm.username" class="register-content"></el-input></div>
                  </el-form-item>
                  <el-form-item prop="password" class="register-item">
                    <div class="register-title">密码:<el-input type="password" v-model="registerForm.password" class="register-content"></el-input></div>
                  </el-form-item>
                  <el-form-item prop="confirmPassword" class="register-item">
                    <div class="register-title">确认密码:<el-input type="password" v-model="registerForm.confirmPassword" class="register-content"></el-input></div>
                  </el-form-item>
                  <span slot="footer" class="dialog-footer">
                  <el-button @click="handleClose">取消</el-button>
                  <el-button type="primary" @click="handleSubmit">注册</el-button>
                  </span>
                </el-form>
              </el-dialog>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {login,register} from "@/request/api.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

export default {
  name: 'login',
  data(){
    return{
      loginForm:{
        name: "",
        password: ""
      },
      registerForm:{
        username: "",
        password: "",
        confirmPassword: ""
      },
      // 给服务器的注册内容
      registerBox:{
        name: "",
        password: "",
      },
      userToken:"",
      // 判断注册框是否显示
      visible:false,
      // 注册时输入规则
      // rules :{
      //   username: [
      //     { required: true, message: '请输入用户名', trigger: 'blur' },
      //   ],
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //   ],
      //   confirmPassword: [
      //     { required: true, message: '请确认密码', trigger: 'blur' },
      //     { validator: this.validateConfirmPassword, trigger: 'blur' },
      //   ],
      // }
    }
  },
  methods:{
    handleLogin(){
      console.log(this.loginForm)
      login(this.loginForm).then(res=>{
        if (res.code===200){
          console.log("正在验证")
          console.log(res)
          this.userToken = res.data.token
          // 暂时将token保存在localStorage中
          localStorage.setItem("token",this.userToken)
          router.push("/default")
        }
      })
    },
    // 打开弹窗
    handleRegister(){
      console.log(1)
      this.visible=true

    },
    // 关闭弹窗
    handleClose(){
      this.visible=false
    },
    // 注册逻辑
    handleSubmit(){
      this.registerBox.name=this.registerForm.username
      this.registerBox.password=this.registerForm.password
      console.log(this.registerBox)
      register(this.registerBox).then((res) => {
        if (res.code===200) {
          // 在这里添加注册逻辑，例如发送请求到服务器
          ElMessage.success('注册成功！');
          this.visible=false
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    //验证密码
    validateConfirmPassword(rule, value, callback){
      if (value !== this.registerForm.password) {
        callback(new Error('密码和确认密码不一致'));
      } else {
        callback();
      }
    }
  }
}
</script>
<style>
//  通过层次堆叠来进行背景毛玻璃效果
.back{
  height: 100vh; /* 使用视口高度，确保全屏覆盖 */
  width: 100vw; /* 使用视口宽度，确保全屏覆盖 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-size: cover;
  background: url('https://iotekimg.zhizuobiao.com/zzb/201127093107/F4B3.jpg'); /* 设置背景图片 */
  overflow: hidden; /* 防止内容溢出 */
}
.blur_box{
  z-index: 0;/* 为不影响内容显示必须为最高层 */
  position: relative;
  width: 100%;
  height: 100%;
}
.blur_box::before{
  width: 300%;
  height: 100vh;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-size: cover;
  content: "";/* 必须包括 */
  position: absolute;/* 固定模糊层位置 */
  z-index: -2;/* 模糊层在最下面 */
  background: url('https://iotekimg.zhizuobiao.com/zzb/201127093107/F4B3.jpg');; /* 设置背景图片 */
  /* 添加以下毛玻璃效果 */
  filter: blur(6px); /* 应用毛玻璃效果 */
}
.login{
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  z-index: -1; /*确保子盒子位于元素之上*/
  position: absolute; /* 添加绝对定位 */
  top: 250px;
  left: 650px;
  height: 400px;
  width: 500px;
  border-radius: 20px;
  .login-card{
    height: 100%;
    width: 100%;
    .title-container{
      margin-top: -18px;
      width: 100%;
      height: 60px;
      text-align: center;
      justify-content: center;
      background-color: cadetblue;
      border-radius: 5px 5px 0 0;
      .title{
        line-height: 60px;
      }
    }
    .form-container{
      margin-top: 30px;
      .form-item{
        margin-left: 60px;
        margin-top: 20px;
        display: flex;
        .input-title{
          display: flex;
        }
        .input-content{
          display: flex;
          width: 300px;
        }
      }
      .form-button{
        margin-left: 90px;
        margin-top: 20px;
      }
      .dialog{
        position: absolute;
        top: 120px;
        left: 650px;
        height: 400px;
        box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
        border-radius: 10px;
        .register-box{
          .register-item{
            display: flex;
            .register-title{
              display: flex;
            }
            .register-content{
              display: flex;
              width: 300px;
            }
          }
        }

      }
    }
  }
}
</style>
