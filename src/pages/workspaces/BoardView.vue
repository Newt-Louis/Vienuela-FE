<script setup>
import { StarFilled } from '@ant-design/icons-vue';
import {reactive, onBeforeMount, ref, watchEffect, onMounted, watch} from "vue";
import {notification} from "ant-design-vue";
import {useRoute} from "vue-router";
import {useMenuActiveKey} from "../../store/menuactivekeystore/use-menu-active-key.js";
import ComponentBoard from "../../components/boardcomponent/ComponentBoard.vue";
import {useBoardStore} from "../../store/crudboard.js";
import {useWorkSpaceStore} from "../../store/crudworkspace.js";
import {useUserStore} from "../../store/userstorelog.js";

const isReady = ref(false);
const boardsStores = useBoardStore();
const workspacesStores = useWorkSpaceStore();
const userStores = useUserStore();
const useMenuActive = useMenuActiveKey();
const routes = useRoute();
const dataBoardResponse = ref([]);
useMenuActive.getOpenKeys(['sub1']);
useMenuActive.getSelectedKey(['workspaces']);
workspacesStores.fetchWorkSpaceOwned();
/*const starredStyle = {
  color: 'yellow',
  position: 'absolute',
  right: '5%',
  bottom: '5%',
}*/
watchEffect(async () => {
  isReady.value = false;
  try {
    const newWorkSpaces = workspacesStores.workspaceStoreOwned;
    if (newWorkSpaces && newWorkSpaces.length>0){
      for (const workspace of newWorkSpaces) {
        await boardsStores.getBoardOwned(workspace.workspaceId);
      }
      isReady.value = true;
    }
    console.log(boardsStores.boardStoreOwned);
  } catch (e) {
    console.log(e)
  }
})
/*watch(workspacesStores.workspaceStoreOwned, async (newVal,oldVal) => {
  if (newVal){
    await workspacesStores.fetchWorkSpaceOwned();
    for (let i = 0; i < newVal.length; i++) {
      await boardsStores.getBoardOwned(newVal[i].workspaceId);
      console.log(boardsStores.boardStoreOwned)
    }
    isReady.value = true;
  } else if (oldVal){
    console.log(boardsStores.boardStoreOwned)
  }
},
    {immediate: true}
)*/
</script>

<template>
<div v-if="isReady">
  <a-divider>
    <a-typography-title :level="2">Bảng được đánh dấu</a-typography-title>
  </a-divider>
  <a-empty></a-empty>
  <!--<ComponentBoard></ComponentBoard>-->
  <a-divider>
    <a-typography-title :level="2">Bảng trong không gian làm việc</a-typography-title>
  </a-divider>
  <a-empty v-if="workspacesStores.workspaceStoreOwned.length === 0"></a-empty>
  <div v-for="(i,index) in workspacesStores.workspaceStoreOwned" :key="index" v-else>
    <a-divider orientation="left">Không gian làm việc {{i.workspaceTitle}}</a-divider>
    <ComponentBoard :data-board-response="boardsStores.boardStoreOwned[i.workspaceId]"></ComponentBoard>
  </div>
  <a-divider>
    <a-typography-title :level="2">Bảng tham gia</a-typography-title>
  </a-divider>
  <a-empty></a-empty>
  <!--  <ComponentBoard></ComponentBoard>-->
</div>
<div v-else>
  <a-skeleton active></a-skeleton>
</div>
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
