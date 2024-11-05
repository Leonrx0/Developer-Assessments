<template>
    <div class="header">
        <div class="header-icon">
            <i class="iconfont icon-shujuju"></i>
        </div>
        <div class="header-title">Github数据分析</div>
    </div>
</template>
  
<script>

  
export default {
    name: 'eHeader',
}
</script>
  
<style>
.header{
  font-size: 20px;
  height: 40px;
  display: flex;
  margin-top:10px;
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
    width: 150px;
    display: flex;
    /* background-color: red; */
  }
}
</style>
  