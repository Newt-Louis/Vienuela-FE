<script setup>
import {StarFilled} from "@ant-design/icons-vue";

const props = defineProps({
  dataBoardResponse: {
    type: Array,
  }
})
</script>

<template>
  <a-empty v-if="dataBoardResponse.length === 0 || null || undefined"></a-empty>
  <a-row :gutter="[48,16]" v-else>
  <a-col :span="6" v-for="(item, index) in dataBoardResponse" :key="{index}">
    <router-link :to="{name: 'board', params: {id: item.id_board}}">
      <div class="containerBoxBoard" :style="{backgroundImage: item.belongs_to_background_colors.bgcolor_name}">
        <h4 class="titleBoxBoard">{{item.title_board}}</h4>
        <StarFilled class="starred"></StarFilled>
      </div>
    </router-link>
  </a-col>
  </a-row>
</template>

<style scoped>
.containerBoxBoard{
  min-height: 80px;
  max-width: 100%;
  padding: 16px;
}
.containerBoxBoard:hover{
  opacity: 0.5;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}
.containerBoxBoard:active{
  outline: solid rgba(0, 119, 255, 0.5) 2px;
  outline-offset: 2px;
}
.titleBoxBoard{
  color: white;
}
.starred{
  position: absolute;
  right: 42px;
  bottom: 16px;
}
.check-starred{
  color: yellow;
}
</style>