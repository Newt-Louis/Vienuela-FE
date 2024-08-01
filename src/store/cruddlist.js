import {defineStore} from "pinia";
import {ref} from "vue";
import {notification} from "ant-design-vue";
import {useBoardStore} from "./crudboard.js";

export const useListStore = defineStore('lists', () => {
/*| crudlist.js sẽ gặp tình trạng lỗi nhiều vì ở đây nó chỉ là 1 biến ref mảng rỗng chứ chưa hề có
* | giá trị gì trong đó cả nên các thuộc tính trong mỗi phần từ trong mảng này sẽ là chưa tồn tại
* | nên thường sẽ dẫn đến rất nhiều lỗi, và vì ở đây chúng ta chưa thấy lỗi là do trong draggable
* | thuộc tính :list để nhận mảng kéo thả chỉ cần biết là nhận vào 1 mảng là được còn rỗng hay không
* | nó không quan tâm nên sẽ không báo lỗi, tương tự với v-for trong ComponentList cũng vậy, miễn là
* | giá trị cho trước này có tồn tại trong file thì nó sẽ không gây lỗi, và chấp nhận mảng rỗng.
* | Riêng với thuộc tính :list trong draggable nó chỉ chấp nhận 1 mảng được truyền vào, có nghĩa là
* | giá trị đang được đưa vào đó là 1 mảng thì chấp nhận. Và trường hợp nhận lỗi là khi đưa vào nó 1
* | giá trị khác, ví dụ nếu thuộc tính của 1 đối tượng là 1 mảng thì nó vẫn chấp nhận.*/
  const listsStore= ref([]);
  const stateListStore = ref({
    isInputStatusNewList : '',
    dataErrorNewList : {},
    isInputStatusUpdateTitleList : '',
    dataErrorUpdatedTitleList: {},
  })
  const boardsStoreInfo = useBoardStore();
  /*Trường hợp bị mất dữ  liệu sau khi reload trang là do HMR (Hot Modules Replacement) trong vuejs
  * đây là 1 tính năng của ứng dụng vuejs giúp cập nhật chỉ một phần của ứng dụng mà không phải tải
  * lại toàn bộ trang, và HMR không hoạt động khi làm mới trang. Vuejs cũng sử dụng hệ thống phản
  * ứng để tự động cập nhật giao diện khi người dùng thay đổi dữ liệu, và cả việc này cũng không
  * hoạt động khi làm mới trang, tất cả dữ liệu sẽ mất, Vuejs không lưu trữ trạng thái của ứng dụng
  * giữa các phiên làm mới trang. Do đó chúng ta phải sử dng localStorage của javascript để lưu dữ liệu.
  * Biến savedLists sẽ nhận giá trị từ localStorage với key là lists*/
  // const savedLists = localStorage.getItem('lists');
  /*Kiểm tra giá trị của biến savedLists có null hay không nếu có giá trị thì chuyển đổi thành
  * dữ liệu json và trả về ref lists*/
 /* if (savedLists) {
    lists.value = JSON.parse(savedLists);
  }*/
  /*Phương thức watch của vue sẽ theo dõi phản ứng của ref lists để cập nhật gia trị*/
 /* watch(lists, (newLists) => {
    localStorage.setItem('lists', JSON.stringify(newLists));
  })*/
    function updateErrorUpdatedTitleList(error){
      if (error.hasOwnProperty('errors')){
        stateListStore.value.dataErrorUpdatedTitleList = error.errors;
        stateListStore.value.isInputStatusUpdateTitleList = 'error';
      } else {
        stateListStore.value.dataErrorUpdatedTitleList = {};
        stateListStore.value.isInputStatusUpdateTitleList = '';
      }
    }
    function updateErrorAddNewList(error) {
      if (error.hasOwnProperty('errors')){
        stateListStore.value.dataErrorNewList = error.errors;
        stateListStore.value.isInputStatusNewList = 'error';
      } else {
        stateListStore.value.isInputStatusNewList = '';
        stateListStore.value.dataErrorNewList = {};
      }
    }
    function updateListsData(data){
      listsStore.value = data.map((item) => {
        return {
          idBoard: item.id_board,
          idList: item.id_list,
          titleList: item.title_list,
          positionList: item.position_list,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          deletedAt: item.delete_at,
        }
      })
    }
    function fetchLists(idBoard){
      axios.get('http://127.0.0.1:8000/api/list/view/' + idBoard)
        .then((response) => {
          console.log(response.data)
          updateListsData(response.data);
        })
        .catch((error)=>{
          notification.error({
            message: "Lỗi kết nối vui lòng thử lại !!!",
            description: error.response.data.message,
            placement: "topRight",
          })
        })
    }
    function addAListInThisBoard(dataInfoList){
      axios.post('http://localhost:8000/api/list/add_list',dataInfoList)
        .then((response) => {
          updateListsData(response.data);
          updateErrorAddNewList(response.data)
          notification.success({
            message: 'Tạo danh sách mới thành công',
            description: 'Danh sách mới trong bảng: '+boardsStoreInfo.boardStore.titleBoard,
            placement: 'topRight',
          })
        })
        .catch((error) => {
          updateErrorAddNewList(error.response.data);
          notification.error({
            message: 'Tạo mới danh sách thất bại !!!',
            description: error.response.data.message,
            placement: 'topRight',
          })
        })
    }
    function renameThisList(dataToRename){
      axios.post('http://127.0.0.1:8000/api/list/update_title',dataToRename)
        .then((response) => {
          fetchLists(boardsStoreInfo.boardStore.idBoard)
          updateErrorUpdatedTitleList(response.data);
          notification.success({
            message:'Đổi tên thành công',
            placement: "topRight",
          })
        })
        .catch((error) => {
          updateErrorUpdatedTitleList(error.response.data)
          notification.error({
            message: 'Đổi tên không thành công !',
            description: error.response.data.message,
            placement: "topRight",
          })
        })
    }
    async function softDeleteThisListById(idList) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/list/delete/'+idList)
        if (response.data.success){
          fetchLists(boardsStoreInfo.boardStore.idBoard)
          notification.success({
            message: 'Xóa danh sách thành công',
            description: response.data.message,
            placement: "topRight",
          })
        }
        console.log('sử dụng softDeleteThisListById')
      } catch (error){
        if (error.response.data.success){
          notification.error({
            message: 'Xóa thất bại',
            description: error.response.data.message,
            placement: "topRight",
          })
        }
        console.log('sử dụng softDeleteThisListById')
      }
    }
return  { listsStore,fetchLists,stateListStore,addAListInThisBoard,renameThisList,softDeleteThisListById }
})