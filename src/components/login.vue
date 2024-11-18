<template>
  <div class="back">
    <div :class="isActive?'login-info':'login-info-back'">
      <div class="info-image">
        <el-image src="src/assets/GitHub-Symbol.png"  style="object-fit: cover;"/>
      </div>
      <div style="position: absolute;z-index: 1;top: 60%;left: 40%;">
        <span id="text" style="color: black;font-size: 28px;font-style: italic;">Starting~~~~</span>
      </div>
      <div class="transition">
        <Transition name="fade">
          <div class="circle" v-show="IsShow">Rank</div>
        </Transition>
        <Transition name="fade1">
          <div class="circle1" v-show="IsShow1">Search</div>
        </Transition>
        <Transition name="fade2">
          <div class="circle2" v-show="IsShow2">KIMI</div>
        </Transition>
      </div>
      <div v-if="isActive" class="login-arrow" @click="stretchInfo()">
        <i class="iconfont icon-arrowrightl"></i>
      </div>
    </div>
    <div :class="isActive?'login-main':'login-main-back'">
      <div v-if="!isActive" class="login-arrow-left" @click="stretchInfo()">
        <i class="iconfont icon-arrowleftl"></i>
      </div>
      <el-card class="login-card">
        <div class="title-container"> <h3 class="title">用户登录</h3> </div>  <!-- 标题 -->
        <div class="form-container">
          <el-form class="login-form">
            <el-form-item prop="username" class="form-item">
              <div class="input-title">账户:&nbsp;&nbsp;<el-input placeholder="username" name="username" type="text" v-model="loginForm.name" class="input-content"/></div>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
              <div class="input-title">密码:&nbsp;&nbsp;<el-input placeholder="password" name="password" v-model="loginForm.password" class="input-content"/> </div>
            </el-form-item>
            <div @click="handleRegister" class="register-text">点击注册?</div>
            <el-button type="primary" style="width: 20%; margin-bottom: 30px" @click="handleLogin" class="form-button">登录</el-button>
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
        <div class="bottom-text">Welcome to GitRuru!</div>
      </el-card>
    </div>
  </div>
</template>
<script>

import {login,register} from "@/request/api.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";
import Typed from "typed.js";

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
      textEl: document.querySelector('#text'),
      text: "欢迎来到GitRuru数据中心！\n",
      count: 1,
      speed: 200,

      IsShow:false,
      IsShow1:false,
      IsShow2:false,

      isActive:true
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
  mounted() {

    this.writeText();
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
    },
    writeText() {
      document.getElementById('text').innerText = this.text.slice(0, this.count);
      console.log(this.text.slice(0, this.count))
      this.count++;
      // 循环播报
      // if (this.count > this.text.length) {
      //   this.count = 1;
      // }
      setTimeout(this.writeText, this.speed);
      if (this.count===this.text.length){
        this.circleShow()
      }
    },
    stretchInfo(){
      this.isActive=!this.isActive;
    },
    circleShow(){
      this.IsShow = true
      // this.IsShow1 = true
      // this.IsShow2 = true
      setTimeout(()=>{this.IsShow1 = true},3000)
      setTimeout(()=>{this.IsShow2 = true},4500)

    }


  }
}
</script>
<style>
.back{
  height: 100vh; /* 使用视口高度，确保全屏覆盖 */
  display: flex;
  .login-info{
    box-shadow: 10px 0 8px rgba(0,0,0,0.5);
    position: relative;
    height: 100%;
    width: 55%;
    display: flex;
    background-color:white;
    .info-image{
      z-index: 0;
      height: 600px;
      width: 600px;
      border-radius:50%;
      margin:auto;
    }
    .login-arrow{
      width: 150px;
      height: 150px;
      border-radius: 50%;
      text-align: center;
      line-height: 150px;
      float: right;
      left: 90%;
      position: absolute;
      top:40%;
      background-color: white;
    }
    .transition{
      position: absolute;
      top: 70%;
      left:70%;
      .fade-enter-active,
      .fade-leave-active,
      .fade1-leave-active,
      .fade1-enter-active,
      .fade2-leave-active,
      .fade2-enter-active{
        transition: opacity 1.5s linear;
      }
      .fade-enter-from,
      .fade-leave-to,
      .fade1-enter-from,
      .fade1-leave-to,
      .fade2-enter-from,
      .fade2-leave-to{
        opacity: 0;
      }
      .circle{
        position: absolute;
        z-index: 1;
        width: 60px;
        height:60px;
        border-radius:50%;
        line-height: 60px;
        font-size: 18px;
        margin-top: 10px;
        text-align: center;
        background-color: palevioletred;
        opacity: 80%;
      }
      .circle1{
        position: absolute;
        z-index: 0;
        width: 80px;
        height:80px;
        border-radius:50%;
        line-height: 80px;
        font-size: 18px;
        margin-left: 50px;
        text-align: center;
        background-color: cornflowerblue;
      }
      .circle2{
        position: absolute;
        z-index: 2;
        width: 60px;
        height:60px;
        margin-left: 30px;
        margin-top: 45px;
        border-radius:50%;
        line-height: 60px;
        font-size: 18px;
        text-align: center;
        opacity: 80%;
        background-color: darkseagreen;
      }

    }

  }
  .login-info-back{
    box-shadow: 10px 0 8px rgba(0,0,0,0.5);
    position: relative;
    height: 100%;
    width: 45%;
    display: flex;
    background-color:white;
    .info-image{
      z-index: 0;
      height: 600px;
      width: 600px;
      border-radius:50%;
      margin:auto;
    }
    /*.login-arrow{
      width: 150px;
      height: 150px;
      border-radius: 50%;
      text-align: center;
      line-height: 150px;
      float: right;
      left: 90%;
      position: absolute;
      top:40%;
      background-color: white;
    }*/
    .transition{
      position: absolute;
      top: 70%;
      left:70%;
      .fade-enter-active,
      .fade-leave-active,
      .fade1-leave-active,
      .fade1-enter-active,
      .fade2-leave-active,
      .fade2-enter-active{
        transition: opacity 1.5s linear;
      }
      .fade-enter-from,
      .fade-leave-to,
      .fade1-enter-from,
      .fade1-leave-to,
      .fade2-enter-from,
      .fade2-leave-to{
        opacity: 0;
      }
      .circle{
        position: absolute;
        z-index: 1;
        width: 60px;
        height:60px;
        border-radius:50%;
        line-height: 60px;
        font-size: 18px;
        margin-top: 10px;
        text-align: center;
        background-color: palevioletred;
        opacity: 80%;
      }
      .circle1{
        position: absolute;
        z-index: 0;
        width: 80px;
        height:80px;
        border-radius:50%;
        line-height: 80px;
        font-size: 18px;
        margin-left: 50px;
        text-align: center;
        background-color: cornflowerblue;
      }
      .circle2{
        position: absolute;
        z-index: 2;
        width: 60px;
        height:60px;
        margin-left: 30px;
        margin-top: 45px;
        border-radius:50%;
        line-height: 60px;
        font-size: 18px;
        text-align: center;
        opacity: 80%;
        background-color: darkseagreen;
      }

    }

  }
  .login-main{
    height: 100%;
    width: 45%;
    display: flex;
    background-color: #2c3e50;
    /* background: url('https://iotekimg.zhizuobiao.com/zzb/201127093107/F4B3.jpg'); /* 设置背景图片 */
    /*.login-arrow-left{
      position: absolute;
      float: right;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      text-align: center;
      line-height: 150px;
      right: 90%;
      top:40%;
      background-color: #2c3e50;
    }*/
    .login-card{
      width: 500px;
      height: 500px;
      margin-left: 20%;
      margin-top: 25%;
      background-color: white;
      box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;
      .title-container{
        margin-top: 20px;
        width: 100%;
        height: 60px;
        text-align: center;
        justify-content: center;
        border-radius: 5px 5px 0 0;
        .title{
          line-height: 60px;
          font-size: 40px;
        }
      }
      .form-container{
        margin-top: 60px;
        .register-text:hover{
          float: right;
          margin-right: 60px;
          margin-top: -10px;
          font-size: 14px;
          color:#0086b3;
          cursor: pointer;
        }
        .register-text{
          float: right;
          margin-right: 60px;
          margin-top: -10px;
          font-size: 12px
        }
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
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
          }
        }
        .form-button{
          margin-left: 200px;
          margin-top: 20px;
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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
      .bottom-text{
        text-align: center;
        line-height: 60px;
        font-size: 30px;
      }
    }
  }
  .login-main-back{
    box-shadow: -10px 0 8px rgba(0,0,0,0.5);
    height: 100%;
    width: 55%;
    display: flex;
    position: relative;
    background-color: #2c3e50;
    /* background: url('https://iotekimg.zhizuobiao.com/zzb/201127093107/F4B3.jpg'); /* 设置背景图片 */
    .login-arrow-left{
      position: absolute;
      float: right;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      text-align: center;
      line-height: 150px;
      right: 90%;
      top:40%;
      background-color: #2c3e50;
    }
    .login-card{
      width: 500px;
      height: 500px;
      margin-left: 20%;
      margin-top: 25%;
      background-color: white;
      box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;
      .title-container{
        margin-top: 20px;
        width: 100%;
        height: 60px;
        text-align: center;
        justify-content: center;
        border-radius: 5px 5px 0 0;
        .title{
          line-height: 60px;
          font-size: 40px;
        }
      }
      .form-container{
        margin-top: 60px;
        .register-text:hover{
          float: right;
          margin-right: 60px;
          margin-top: -10px;
          font-size: 14px;
          color:#0086b3;
          cursor: pointer;
        }
        .register-text{
          float: right;
          margin-right: 60px;
          margin-top: -10px;
          font-size: 12px
        }
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
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
          }
        }
        .form-button{
          margin-left: 200px;
          margin-top: 20px;
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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
      .bottom-text{
        text-align: center;
        line-height: 60px;
        font-size: 30px;
      }
    }
  }

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
.login {
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  z-index: -1; /*确保子盒子位于元素之上*/
  position: absolute; /* 添加绝对定位 */
  top: 250px;
  left: 650px;
  height: 400px;
  width: 500px;
  border-radius: 20px;

}
</style>
