<template>
  <div>
    <div v-if="!inEdit">

    </div>
    <div v-if="inEdit">

    </div>
  </div>
</template>

<script>
  export default {
    name: "StoreDetail",
    data(){
      return {
        inEdit:'',
      }
    },
    mounted(){

    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
