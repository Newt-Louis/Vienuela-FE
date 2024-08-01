import {defineStore} from "pinia";
import {ref} from "vue";
import {notification} from "ant-design-vue";
import dayjs from "dayjs";

export const useDueDatesStore = defineStore('cardDetails', () => {
  const cardsDueDateStore = ref({});
  const stateStatusDueDateStore = ref({
    isInputDate: '',
    statusWarning: '',
    statusDanger:'',
    dataErrorDueDate: {},
  });

  function createOrUpdateDueDate(idCard,data){
    cardsDueDateStore.value[idCard] = {
      idCard: data.id_card,
      startDate: data.start_date ? data.start_date : null,
      dueDate: data.due_date ? data.due_date : null,
      warningInfo: data.warning ? data.warning.toString() : null,
      dangerInfo: data.danger ? data.danger.toString() : null,
      isDueDateDone: !!data.is_duedate_done,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
    };
  }
  async function fetchDueDateWhenCardHave(idCard) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deadline/view/'+idCard);
      createOrUpdateDueDate(idCard,response.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại',
        description: 'Lỗi hiển thị thông tin đáo hạn',
        placement: "topRight",
      })
    }
  }
  async function createOrUpdateDueDateThisCard(dataDueDateToAdd){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deadline/create_or_update', dataDueDateToAdd);
      createOrUpdateDueDate(dataDueDateToAdd.idCard,response.data);
    } catch (error) {
      notification.error({
        message: 'Có lỗi với thời gian bạn đã chọn, vui lòng thử lại !',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function createOrUpdateWarning(dataWarningToAdd){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deadline/create_or_update_warning', dataWarningToAdd);
      createOrUpdateDueDate(dataWarningToAdd.idCard, response.data);
    } catch (error) {
      console.log(error)
      notification.error({
        message: error.response.data.message,
        placement: "topRight",
      })
      throw error;
    }
  }
  async function createOrUpdateDanger(dataDangerToAdd){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deadline/create_or_update_danger', dataDangerToAdd);
      createOrUpdateDueDate(dataDangerToAdd.idCard, response.data);
    } catch (error) {
      notification.error({
        message: error.response.data.message,
        placement: "topRight",
      })
      throw error;
    }
  }
  async function checkDoneDueDateForThisCard(dataCheckDone) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deadline/update_is_this_card_duedate_done', dataCheckDone);
      createOrUpdateDueDate(dataCheckDone.idCard,response.data);
    } catch (error){
      notification.error({
        message: 'Lỗi kết nối với máy chủ',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  return {
    cardsDueDateStore,
    stateStatusDueDateStore,
    fetchDueDateWhenCardHave,
    createOrUpdateDueDateThisCard,
    createOrUpdateWarning,
    createOrUpdateDanger,
    checkDoneDueDateForThisCard,
  }
})
