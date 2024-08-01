import { defineStore } from "pinia";
import {ref} from "vue";
import {notification} from "ant-design-vue";

export const  useLabelsStore = defineStore('labels', () => {
  const labelsOfCard = ref({});
  const stateLabelsCard = ref({
    statusAddNewLabel: '',
    dataErrorAddNewLabel: {},
    statusTitleUpdate: '',
    dataErrorTitleUpdate: {},
  })
  function createOrUpdateLabelsOfCard(data,idCard){
    /*Lưu ý: vì server xử lý với bảng ở quan hệ nhiều - nhiều nên mỗi đối tượng sẽ có thêm
    * 1 thuộc tính là pivot và thuộc tính này là 1 đối tượng chứa toàn bộ dữ liệu của bảng
    * trung gian.
    * (3) [{…}, {…}, {…}] <-- ví dụ nhận dữ liệu về là 1 mảng tương ứng với <-- response.data
    * 1 đối tượng trong mảng trên sẽ có dữ liệu như sau:
    * 0: <-- phần tử mảng ở vị trí 0
        color_name: "wheat"
        id_color: 1
        pivot: <-- 1 thuộc tính của phần tử của mảng, thuộc tính này lại là 1 đối tượng
          created_at: "2024-05-30T04:16:20.000000Z"
          deleted_at: null
          id_card: 88
          id_color: 1
          short_title: null
          updated_at: "2024-05-30T04:16:20.000000Z"
     */
    labelsOfCard.value[idCard] = data.map((item) => {
      return {
        idCard: item.pivot.id_card,
        idColor: item.id_color,
        labelColor: item.color_name,
        shortTitle: item.pivot.short_title,
        createdAt: item.pivot.created_at,
        updatedAt: item.pivot.updated_at,
        deletedAt: item.pivot.deleted_at,
      }
    })
  }
  function updateAddNewLabelToThisCard(data){
    if (data.hasOwnProperty('errors')){
      stateLabelsCard.value.statusAddNewLabel = 'error';
      stateLabelsCard.value.dataErrorAddNewLabel = data.errors;
    } else {
      stateLabelsCard.value.statusAddNewLabel = '';
      stateLabelsCard.value.dataErrorAddNewLabel = {};
    }
  }
  function updateTitleLabelOfThisCard(data){
    if (data.hasOwnProperty('errors')){
      stateLabelsCard.value.statusTitleUpdate = 'error';
      stateLabelsCard.value.dataErrorTitleUpdate = data.errors;
    } else {
      stateLabelsCard.value.statusTitleUpdate = '';
      stateLabelsCard.value.dataErrorTitleUpdate = {};
    }
  }
  async function fetchLabelsInThisCard(idCard){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/label/label_belongs_this_card/' + idCard);
      createOrUpdateLabelsOfCard(response.data,idCard);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại !',
        placement: "topRight",
      })
    }
  }
  async function addALabelsToThisCard(dataToAdd){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/label/add', dataToAdd);
      updateAddNewLabelToThisCard(response.data);
      createOrUpdateLabelsOfCard(response.data,dataToAdd.idCard);
    //   Thành công thì truyền response.data
    } catch (error) {
      updateAddNewLabelToThisCard(error.response.data);
      notification.error({
        message: 'Tạo nhãn không thành công !',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  //   Lỗi thì truyền  error.response.data
  }
  async function updateTitleOfLabelsInThisCard(dataToUpdate) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/label/update_title', dataToUpdate);
      createOrUpdateLabelsOfCard(response.data,dataToUpdate.idCard);
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, vui lòng thử lại !',
        placement: "topRight",
      })
    }
  }
  async function softDeleteLabelInThisCard(dataToDelete) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/label/soft_delete',dataToDelete);
      createOrUpdateLabelsOfCard(response.data,dataToDelete.idCard);
    } catch (error){
      notification.error({
        message: 'Lỗi kết nối đến máy chủ !',
        placement: "topRight",
      })
    }
  }
  return {
    labelsOfCard,
    stateLabelsCard,
    fetchLabelsInThisCard,
    addALabelsToThisCard,
    updateTitleOfLabelsInThisCard,
    softDeleteLabelInThisCard,
  }
})