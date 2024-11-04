<template>
    <div id="container">
        <eHeader></eHeader>
        <aSider></aSider>
    </div>
</template>
  
<script>
import eHeader from "@/components/Header.vue"
import aSider from "@/components/Asider.vue"
export default {
    name: 'Home',
    components:{
        eHeader,aSider
    }
}
</script>
  
<style>
.container{
    
}
</style>
  