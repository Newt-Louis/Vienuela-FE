import {defineStore} from "pinia";
import {ref, computed, reactive} from "vue";
import {notification} from "ant-design-vue";

export const useBoardStore = defineStore('board',() =>{
  /*| Khi một component bắt đầu được tạo ra thì mặc định các template của nó luôn được thư thi
  * | trước nghĩa là trong quá trình created() và beforeCreate() thì nó đã luôn được chạy trước
  * | và không hề đợi promise thực hiện truy vấn tới cơ sở dữ liệu xong thì mới có kết quả render
  * | vì thế ta phải lưu ý đến các vấn đề về sử dụng các biến logic mà khi đó chưa có dữ liệu
  * | để tránh gặp lỗi, trong trường hợp của Board thì vì nó là 1 đối tượng có sẵn các thuộc tính
  * | rỗng ở đây nên khi component Board này được tạo ra các đối tượng này mặc định là đã có tồn
  * | tại nên trang BoardLayout không hề gặp lỗi.
  * | Đến file crudlist.js sẽ nhận thêm lỗi xử lý trước khi hiển thị*/
  /*---------------------------------Thông tin của 1 Board cho BoardLayout.vue----------------------------------*/
const boardStore = reactive({
  idBoard : null,
  idWorkspace: null,
  idBgcolor: null,
  titleBoard: '',
  bgcolorName: '',
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});
 /*2 Store của Board là owned và joined dựa trên id của workspace => cấu trúc là đối tượng và tên thuộc tính sẽ là
 * id của workspace. Đồng thời cũng có 2 phương thức để cập nhật dữ liệu cho 2 store này.*/
  const boardStoreOwned = ref({});
  const boardStoreJoined = ref({});
  function createOrUpdateBoardOwned(idworkspace,data) {
    boardStoreOwned.value[idworkspace] = data;
  }
  /*-----------------------Lấy dữ liệu cho board store dựa theo sự thay đổi của workspace-------------------------------------------*/
  async function getBoardOwned(idWorkSpace){
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/board/view_board_by_workspace/'+idWorkSpace);
      createOrUpdateBoardOwned(idWorkSpace,response.data)
    } catch (e) {
      console.log(e)
    }
  }
  async function getBoardJoined(idWorkSpace){
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/board/view_board_by_workspace/'+idWorkSpace);
      console.log(response);
    } catch (e) {
      console.log(e)
    }
  }
  /*---------------------------lấy dữ liệu của 1 board cho boardlayout.vue-----------------------------------*/
 function fetchBoard(boardId) {
        axios.get('http://127.0.0.1:8000/api/board/view/' + boardId)
          .then((response) => {
            boardStore.idBoard = response.data[0].id_board;
            boardStore.idWorkspace = response.data[0].id_workspace;
            boardStore.titleBoard = response.data[0].title_board;
            boardStore.bgcolorName = response.data[0].bgcolor_name;
            boardStore.idBgcolor = response.data[0].id_bgcolor;
            boardStore.createdAt = response.data[0].created_at;
            boardStore.updatedAt = response.data[0].updated_at;
            boardStore.deletedAt = response.data[0].deleted_at;
          })
          .catch((error) => {
            notification.error({
              message: 'Lỗi kết nối vui lòng thử lại sau!!!',
              description: error.response.data.errors,
              placement:'topRight',
            });
          })
  }
  return { boardStore,boardStoreOwned,boardStoreJoined,getBoardOwned,getBoardJoined,fetchBoard,createOrUpdateBoardOwned }
})