import {defineStore} from "pinia";
import {notification} from "ant-design-vue";
import {ref, computed, reactive} from "vue";
export const useWorkSpaceStore = defineStore('workspace', () => {
  const workspaceStoreOwned = ref([]);
  const workspaceStoreJoined = ref([]);
  const workspaceState = reactive({
    workspaceErrorData: {},
    workspaceInputStatus: '',
    workspaceErrorDataUpdate: {},
    workspaceInputStatusUpdate: '',
  })
  const userStores = useUserStore();
  function createOrUpdateWorkSpace (data){
    workspaceStoreOwned.value = data.map((item) => {
      return  {
        workspaceId: item.id_workspace,
        userId: item.id_user,
        workspaceTitle: item.title_workspace,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
      }
    })
  }
  function updateStatusNewWorkSpace(error){
    if (error.hasOwnProperty('errors')){
      workspaceState.workspaceInputStatus = 'error';
      workspaceState.workspaceErrorData = error.errors;
    } else {
      workspaceState.workspaceInputStatus = '';
      workspaceState.workspaceErrorData = {};
    }
  }
  function updateStatusUpdateWorkSpace(error){
    if (error.hasOwnProperty('errors')){
      workspaceState.workspaceInputStatusUpdate = 'error';
      workspaceState.workspaceErrorDataUpdate = error.errors;
    } else {
      workspaceState.workspaceInputStatusUpdate = '';
      workspaceState.workspaceErrorDataUpdate = {};
    }
  }
  async function fetchWorkSpaceOwned () {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/workspace/owned/'+userStores.userStore.id_user);
      createOrUpdateWorkSpace(response.data);
    }catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra với workspace by user owned',
        description: error,
        placement: "topRight",
      })
      console.log(error);
    }
  }
  async function fetchWorkSpaceJoined() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/workspace/joined/'+userStores.userStore.id_user)
    } catch (error) {
      console.log(error.response);
    }
  }
  async function addNewWorkSpace (dataToAdd) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/workspace/add',dataToAdd)
      createOrUpdateWorkSpace(response.data);
      updateStatusUpdateWorkSpace(response.data);
    } catch (error) {
      updateStatusNewWorkSpace(error.response.data);
    }
  }
  async function updateWorkSpace (dataToUpdate) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/workspace/update',dataToUpdate);
      createOrUpdateWorkSpace(response.data);
      updateStatusUpdateWorkSpace(response.data);
    }catch (error) {
      updateStatusUpdateWorkSpace(error.response.data)
      throw error;
    }
  }
  async function deleteWorkSpace (dataToDelete) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/workspace/soft_delete/',dataToDelete);
      createOrUpdateWorkSpace(response.data);
    }catch (error) {
      console.log(error.response);
      notification.error({
        message: 'Có lỗi xảy ra với máy chủ !!',
        description: 'Không xóa được workspace'+error.response,
        placement: "topRight",
      })
    }
  }

  return  {
    workspaceState,
    workspaceStoreOwned,
    workspaceStoreJoined,
    fetchWorkSpaceOwned,
    fetchWorkSpaceJoined,
    addNewWorkSpace,
    updateWorkSpace,
    deleteWorkSpace,
  }
})

import {useUserStore} from "./userstorelog.js";
