import {defineStore} from "pinia";
import {ref} from "vue";

export const useMenuActiveKey = defineStore('useMenuStore',()=> {
  const openKeys = ref([]);
  const selectedKeys = ref([]);
  const selectedKeysMembers = ref([]);
  function getOpenKeys(value){
    openKeys.value = value;
  }
  function getSelectedKey(value){
    selectedKeys.value = value;
  }
  function getSelectedKeysMember(value){
    selectedKeysMembers.value = value;
  }
  return  {
    openKeys,
    selectedKeys,
    getOpenKeys,
    getSelectedKey,
    selectedKeysMembers,
    getSelectedKeysMember,
  }
})