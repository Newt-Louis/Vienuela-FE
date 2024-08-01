<script setup>
import Header from '../components/Header.vue'
import SideBar from '../components/SideBar.vue'

</script>

<template>
    <div class="headerhompage"><Header/></div>
    <a-row class="bodyhompage">
      <a-col :span="5">
        <SideBar></SideBar>
      </a-col>
      <a-col :span="19" class="contenthomepage">
        <a-layout-content class="content">
          <router-view/>
        </a-layout-content>
      </a-col>
    </a-row>
  <a-layout-footer></a-layout-footer>
</template>

<style scoped>
.headerhompage{
  background-color: transparent;
  width: 100%;
  padding: 0;
  height: 80px;
}
.bodyhompage{
  margin-top: 26px;
}
.contenthomepage {
 padding: 10px 15px 0 15px;
}
</style>