import {ref,reactive,computed} from "vue";
import {useCardStore} from "../store/crudcard.js";
import {useAddMembersStore} from "../store/cardfunctionstore/addMembersStore.js";
import {useCheckListsStore} from "../store/cardfunctionstore/checkListsStore.js";
import {useDueDatesStore} from "../store/cardfunctionstore/dueDateStore.js";
import {useLabelsStore} from "../store/cardfunctionstore/labelsStore.js";
import {notification} from "ant-design-vue";
import dayjs from "dayjs";

export function useCardFunctionLogic(props){
  const useLabelStore = useLabelsStore();
  const descriptionText = ref();
  const filesStore = ref([]);
  const warnShown = ref(true);

  function getCheckListOfThisCard(dataChecklist) {
    return dataChecklist.length;
  }
  function getLabelsOfThisCard(dataLabels){
    let count = dataLabels.length;
    let newArr = [];
    if (count >= 3){
      count = 3;
    }
    for (let i = 0; i<count; i++){
      newArr.push(dataLabels[i]);
    }
    return newArr;
  }
  function getNotifyDueDateOfThisCard(dataDueDate){
    let expiredDay = dataDueDate.dueDate ? dayjs(dataDueDate.dueDate) : null;
    let now = dayjs();
      if (expiredDay === null){
        return {
          getColorOutlineDueDate: 'none',
          dueDateSetTime: '',
        }
      }
    let daysleft = expiredDay.diff(now,'day');
    let warning = dataDueDate.warningInfo;
    let error = dataDueDate.dangerInfo;
    if (warning === null && error === null ){
      return {
        getColorOutlineDueDate: 'none',
        dueDateSetTime: dataDueDate.dueDate,
      };
    } else if (warning === null){
      if (daysleft <= error){
        return {
          getColorOutlineDueDate: 'red',
          dueDateSetTime: dataDueDate.dueDate,
        };
      }
    } else if (error === null){
      if (daysleft <= warning){
        return {
          getColorOutlineDueDate: '#ffb35a',
          dueDateSetTime: dataDueDate.dueDate,
        };
      }
    } else if (warning <= error && warnShown.value){
      notification.warn({
        message: 'Giá trị cảnh báo không khớp !!!',
        description: 'Ngày cận hạn nhỏ hơn ngày đến hạn, vì vậy ngày cận hạn được xem như bỏ qua và chỉ tính thời gian của ngày đến hạn.',
        placement: "topRight",
      })
      warnShown.value = false;
      if (daysleft <= error){
        return {
          getColorOutlineDueDate:'red',
          dueDateSetTime: dataDueDate.dueDate,
        };
      }
    } else {
      if (daysleft <= error){
        return {
          getColorOutlineDueDate:'red',
          dueDateSetTime: dataDueDate.dueDate,
        };
      } else if (daysleft <= warning){
        return {
          getColorOutlineDueDate: '#ffb35a',
          dueDateSetTime: dataDueDate.dueDate,
        };
      } else {
        return {
          getColorOutlineDueDate: 'none',
          dueDateSetTime: dataDueDate.dueDate,
        };
      }
    }
  }
  function createOrUpdateAttachmentThisCard(data) {
    filesStore.value = data.map(item => {
      let partPath = item.attachment_path.split('/');
      let folderPath = partPath[0];
      let fileName = partPath[partPath.length - 1];
      return {
        idCard: item.id_card,
        idAttachment: item.id_attachment,
        attachmentName: item.attachment_name,
        attachmentPath: item.attachment_path,
        attachmentFileName: fileName,
        attachmentFolderPath: folderPath,
        createAt: item.creataed_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
      }
    })
  }
  async function deleteAttachmentInThisCard(idCard,idAttachment,attachmentName){
    let dataToSoftDelete = {
      idCard: idCard,
      idAttachment: idAttachment,
    }
    try {
     const response = await axios.post('http://127.0.0.1:8000/api/upload/soft_delete', dataToSoftDelete);
      createOrUpdateAttachmentThisCard(response.data);
      notification.success({
        message: 'Đã xóa tệp',
        description: 'Tệp: '+attachmentName+' đã được xóa khỏi thẻ: '+props.titleCard,
        placement: "topRight",
      })
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function fetchFilesThisCardHave () {
    await axios.get('http://127.0.0.1:8000/api/upload/view/' + props.idCard)
      .then((response) => {
        createOrUpdateAttachmentThisCard(response.data);
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi kết nối với máy chủ !!!',
          description: error.response.data.message,
          placement: "topRight",
        })
      })
  }
  function  fetchDescriptionCard() {
    axios.get('http://127.0.0.1:8000/api/card/description_fetch/'+props.idCard)
      .then((response) => {
        if (Object.keys(response.data).length === 0 && response.data.constructor === Object){
          return descriptionText.value = '';
        } else {
          return descriptionText.value = response.data;
        }
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi kết nối server, vui lòng thử lại !',
          placement: 'topRight',
        })
      })
  }
  const updateDescription = async () => {
    let dataDescriptToAdd = {
      idCard: props.idCard,
      descriptionText: descriptionText.value,
    }
    await axios.post('http://127.0.0.1:8000/api/card/update_description',dataDescriptToAdd)
      .then((response) => {
        descriptionText.value = response.data;
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi kết nối với máy chủ, vui lòng thử lại !',
          placement: "topRight",
        })
      })
  }
  return {
    descriptionText,
    filesStore,
    getCheckListOfThisCard,
    getNotifyDueDateOfThisCard,
    getLabelsOfThisCard,
    fetchDescriptionCard,
    updateDescription,
    fetchFilesThisCardHave,
    deleteAttachmentInThisCard
  }
}