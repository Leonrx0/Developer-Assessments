<template>
    <div class="header">
        <div class="header-icon">
            <i class="iconfont icon-shujuju"></i>
        </div>
        <div class="header-title">GitGuru数据分析</div>
    </div>
</template>
  
<script>

  
export default {
    name: 'eHeader',
}
</script>
  
<style>
.header{
  z-index: 999;
  position: fixed;
  background-color: white;
  font-size: 20px;
  height: 40px;
  width: 100%;
  display: flex;
  margin-top: -10px;
  margin-left: 170px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
  .header-icon{
    width: 40px;
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    /* background-color: aqua; */
  }
  .header-title{
    margin-top: 5px;
    width: 200px;
    display: flex;
    /* background-color: red; */
  }
}
</style>
  