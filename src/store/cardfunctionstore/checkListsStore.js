import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {notification} from "ant-design-vue";


export const useCheckListsStore = defineStore('checklist', () => {
  const checkListsStore = ref({});
  const stateListNTask = reactive({
    statusNewList: '',
    dataErrorNewList: {},
  })

  function createOrUpdateCheckListsStoreInThisCard(data,idCard) {
    checkListsStore.value[idCard] = data.map(item => {
      return {
        idCard: item.id_card,
        idChecklist: item.id_checklist,
        titleCheckList: item.title_checklist,
        tasks: item.has_many_tasks,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
      }
    })
  }
  async function fetchCheckListInThisCard(idCard){
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/checklist/view/'+idCard);
      createOrUpdateCheckListsStoreInThisCard(response.data,idCard);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function createNewCheckListInThisCard(dataToAdd) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/checklist/add_new_checklist', dataToAdd)
      createOrUpdateCheckListsStoreInThisCard(response.data,dataToAdd.idCard);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function softDeleteCheckListInThisCard(dataToDelete) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/checklist/soft_delete_checklist', dataToDelete);
      createOrUpdateCheckListsStoreInThisCard(response.data,dataToDelete.idCard);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }

  return  {
    checkListsStore,
    stateListNTask,
    fetchCheckListInThisCard,
    createNewCheckListInThisCard,
    softDeleteCheckListInThisCard,
  }
})