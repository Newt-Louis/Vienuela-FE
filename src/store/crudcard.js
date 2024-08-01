import {defineStore} from "pinia";
import {reactive, ref, watch, watchEffect} from "vue";
import {notification} from "ant-design-vue";
import {useBoardStore} from "./crudboard.js";
import {useListStore} from "./cruddlist.js";

export const useCardStore = defineStore('cards', () => {
  /*| crudcard.js vì không có cách lưu dữ liệu trong từng componentlist và nếu lưu theo kiểu
  * | bất đồng bộ như trong mỗi ComponentList thì lại có 1 mảng các card khác nhau thì lúc
  * | truy vấn để di chuyển nó rất khó tiếp cận vì không có nơi lưu trữ cụ thể để chúng ta truy
  * | cập trực tiếp. Giải pháp hiện tại là tạo 1 đối tượng reactive({}) trong đó sẽ tạo các thuộc
  * | tính cho đối tượng này mỗi khi fetch dữ liệu từ server với 1 idList khác nhau sẽ cho ra 1
  * | thuộc tính có chứa 1 mảng trong lists đó. Để dễ hiểu hơn hãy xem cardsStore này như 1 database
  * | và trong database này mỗi thuộc tính là 1 bảng với mỗi bảng sẽ chứa các card khác nhau.
  * | cách để thêm thuộc tính là cú pháp: cardsStore[idList] = <value> --> value sẽ được truyền vào
  * | cho thuộc tính [idList] tương ứng.*/
  const cardsStore = ref({});
  const stateCardStore = ref({
    isInputStatusNewCard: '',
    dataErrorNewCard: {},
    isInputStatusUpdateTitleCard: '',
    dataErrorUpdateTitleCard: {},
  })
  const board = useBoardStore();
  const lists = useListStore();
  /*const savedCards = localStorage.getItem('cards');
  if (savedCards){
    cardsStore.value = JSON.parse(savedCards);
  }
  watch(cardsStore,(newCards) => {
    localStorage.setItem('cards', JSON.stringify(newCards));
  });*/
  function createOrUpdateDataCardsStore(idList,data) {
    cardsStore.value[idList] = data.map((item) => {
      return {
        idCard: item.id_card,
        idList: item.id_list,
        titleCard: item.title_card,
        positionCard: item.position_card,
      }
    });
  }
  function updateErrorUpdateTitleCard(error) {
    if (error.hasOwnProperty('errors')){
      stateCardStore.value.isInputStatusUpdateTitleCard = 'error';
      stateCardStore.value.dataErrorUpdateTitleCard = error.errors;
    } else {
      stateCardStore.value.isInputStatusUpdateTitleCard = '';
      stateCardStore.value.dataErrorUpdateTitleCard = {};
    }
  }
  function updateErrorAddNewCard(error) {
    if (error.hasOwnProperty('errors')){
      stateCardStore.value.isInputStatusNewCard = 'error';
      stateCardStore.value.dataErrorNewCard = error.errors;
    } else {
      stateCardStore.value.isInputStatusNewCard = '';
      stateCardStore.value.dataErrorNewCard = {};
    }
  }
  function fetchCardsViewInList(idList) {
    axios.get('http://127.0.0.1:8000/api/card/view/' + idList)
      .then((response) => {
        createOrUpdateDataCardsStore(idList,response.data);
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi kết nối với máy chủ !!!',
          description: error.response.data.errors,
          placement: 'topRight',
        })
      })
  }
  const infoDetailsCard = ref([]);
  function fetchInfoDetailsCard(idCard) {
    axios.get('http://127.0.0.1:8000/api/card/details/'+ idCard)
      .then((response) => {
        infoDetailsCard.value = response.data;
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi không tìm thấy thẻ tương ứng hoặc không kết nối được với máy chủ !!!',
          description: error.response.data.errors,
          placement: "topRight",
        })
      })
  }
  function addCardIntoList(dataCardAdded) {
    /*Biến getTitleListHere lấy giá trị tiêu đề của list tương ứng.
    * Hàm được viết gọn bằng cách sử dụng phương thức find của array và 1 callback function
    * để trả ra giá trị true false và sau đó nó sẽ chính là đối tượng khi mà được tìm thấy.
    * Sau đó sử dụng ? để sử dụng toán tử tùy chọn chuỗi lấy giá trị thuộc tính titleList,
    * nghĩa là dù có hay không thì nó vẫn lấy, nếu có thuộc tính titleList thì nó lấy giá trị
    * trong đó, ngược lại nếu không có thì nó trả về undefined và không gây lỗi chương trình.*/
    axios.post('http://127.0.0.1:8000/api/card/add',dataCardAdded)
      .then((response) => {
        createOrUpdateDataCardsStore(dataCardAdded.idList,response.data);
        updateErrorAddNewCard(response.data);
        let getTitleListHere = lists.listsStore.find(item => item.idList === dataCardAdded.idList)?.titleList;
        notification.success({
          message: 'Tạo thẻ mới thành công',
          description: 'Thẻ mới trong danh sách: '+getTitleListHere,
          placement: 'topRight',
        })
      })
      .catch((error) => {
        updateErrorAddNewCard(error.response.data);
        notification.error({
          message: "Lỗi kết nối máy chủ !!",
          description: error.response.data.message,
          placement: 'topRight',
        })
      })
  }
  async function updateTitleThisCard(dataCardUpdated){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/card/update_title_card',dataCardUpdated);
      createOrUpdateDataCardsStore(response.data[0].id_list,response.data);
      updateErrorUpdateTitleCard(response.data);
      notification.success({
        message: 'Đổi tiêu đề thành công',
        description: 'Đã đổi tiêu đề thẻ: '+dataCardUpdated.titleCard,
        placement: "topRight",
      })
    }catch (error){
      updateErrorUpdateTitleCard(error.response.data);
      notification.error({
        message: 'Đổi tiêu đề không thành công',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function softDeleteACard(idCard) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/card/soft_delete/' + idCard);
      if (response.data.success){
        createOrUpdateDataCardsStore(response.data.result.original[0].id_list, response.data.result.original);
        notification.success({
          message: 'Xóa thành công',
          description: response.data.message,
          placement: "topRight",
        })
      }
    } catch (error) {
      console.log(error.response)
      notification.error({
        message: 'Không thành công',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  function updateCardMoved (idList,newCardsData){
    cardsStore.value[idList] = newCardsData;
  }
  return {
    cardsStore,
    fetchCardsViewInList,
    infoDetailsCard,
    addCardIntoList,
    stateCardStore,
    updateTitleThisCard,
    fetchInfoDetailsCard,
    softDeleteACard,
    updateCardMoved,
  }
})