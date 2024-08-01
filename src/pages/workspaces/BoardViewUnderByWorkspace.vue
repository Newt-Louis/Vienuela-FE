<script setup>
import {computed, onBeforeMount, onMounted, ref, watch, watchEffect} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {StarFilled} from "@ant-design/icons-vue";
import {useWorkSpaceStore} from "../../store/crudworkspace.js";
import {useBoardStore} from "../../store/crudboard.js";
import {useMenuActiveKey} from "../../store/menuactivekeystore/use-menu-active-key.js";
import ComponentBoard from "../../components/boardcomponent/ComponentBoard.vue";

const routes = useRoute();
const router = useRouter();
const useWorkSpaceStores = useWorkSpaceStore();
const boardsStores = useBoardStore();
const useMenuActive = useMenuActiveKey();
const workspaceInstance = ref({});
const dataBoardResponse = ref([]);
useMenuActive.getOpenKeys(['sub1']);
useMenuActive.getSelectedKey(['workspace_by_user']);
const isStoreHaveData = async () => {
  if (useWorkSpaceStores.workspaceStoreOwned.length === 0 || (boardsStores.boardStoreOwned === null || undefined)){
    try {
      await useWorkSpaceStores.fetchWorkSpaceOwned();
      for (let i = 0; i < useWorkSpaceStores.workspaceStoreOwned.length; i++) {
        await boardsStores.getBoardOwned(useWorkSpaceStores.workspaceStoreOwned[i].workspaceId);
      }
      workspaceInstance.value = useWorkSpaceStores.workspaceStoreOwned.find(workspace => workspace.workspaceId === Number(routes.params.idWorkSpace));
      dataBoardResponse.value = boardsStores.boardStoreOwned[routes.params.idWorkSpace];
    } catch (e) {
      console.log(e);
    }
  } else {
    workspaceInstance.value = useWorkSpaceStores.workspaceStoreOwned.find(workspace => workspace.workspaceId === Number(routes.params.idWorkSpace));
    dataBoardResponse.value = boardsStores.boardStoreOwned[routes.params.idWorkSpace];
  }
}
isStoreHaveData();
watch(boardsStores.boardStoreOwned, (newVal,oldVal) => {
  dataBoardResponse.value = newVal[routes.params.idWorkSpace];
})
</script>

<template>
<div>
  <a-divider>Không gian làm việc {{workspaceInstance.workspaceTitle}}</a-divider>
  <ComponentBoard :data-board-response="dataBoardResponse"></ComponentBoard>
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