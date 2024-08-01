<script setup>
import {ref,reactive} from "vue";
import {notification} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useWorkSpaceStore} from "../../store/crudworkspace.js";
import {useBoardStore} from "../../store/crudboard.js";


/*-------------------------------------Khai báo biến---------------------------------*/
const useWorkSpaceStores = useWorkSpaceStore();
const boardStores = useBoardStore();
const props = defineProps({
  dataBackgroundColor: {
    type: Array,
  },
});
const emit = defineEmits(['update:modelValue']);
const isSelected = ref(null);
const infoCreateBoardSendRequest = reactive({
  title_board: '',
  id_workspace: null,
  id_bgcolor: null,
});
let router = useRouter();
const workspaceBelongToUser = ref([
  {
    label: 'Không gian hiện tại',
    options: useWorkSpaceStores.workspaceStoreOwned.map(item => {
      return {
        label: item.workspaceTitle,
        value: item.workspaceId,
      }
    }),
  },
  {
    label: 'Không gian tham gia',
    options: [
      {
        label: 'Sales ANN',
        value: 1,
      },
      {
        label: 'Information Tech OUK',
        value: 1,
      }
    ]
  }
]);
/*----------------------------------------Các function---------------------------------------*/
/* | Phương thức chọn 1 background cho board, vì trong bảng màu được v-for bên dưới
   | là 1 danh sách được lấy dữ liệu từ database về ở component cha và truyền dữ liệu
   | thông qua 1 props trong component này nên nếu chỉ sử dụng 1 biến ref để đặt class
   | css nào được chọn thì bật active thì gặp lỗi logic là tất cả các nút màu bên dưới
   | đều bật class active này lên, do đo phải sử dụng phép so sánh và lấy vị trí của
*/
const isSelectedBackgroundColor = (color_value,index_color) => {
  isSelected.value = index_color;
  infoCreateBoardSendRequest.id_bgcolor = color_value;
};
/*-------------------Phương thức tạo bảng-----------------------*/
const createBoard = () => {
  axios.post('http://127.0.0.1:8000/api/board/create_board',infoCreateBoardSendRequest)
      .then((response)=>{
        console.log(response)
        let titleWorkspaceInstance = useWorkSpaceStores.workspaceStoreOwned.find(item => item.workspaceId === response.data[0].id_workspace);
          notification.success({
            message: 'Thành công',
            description: 'Bảng '+infoCreateBoardSendRequest.title_board+' tạo mới trong '+titleWorkspaceInstance.workspaceTitle,
            placement: 'topRight',
          });
        boardStores.createOrUpdateBoardOwned(response.data[0].id_workspace,response.data)
      })
      .catch((error) => {
        notification.error({
          message: 'Thất bại',
          description: error,
          placement: 'topRight',
        })
      })
  emit('update:modelValue', false);
}
</script>

<template>
<div id="create_board_component">
  <a-divider orientation="left" class="divider-create-board">Chọn không gian cho bảng</a-divider>
  <a-select
      :options="workspaceBelongToUser"
      style="width: 100%"
      v-model:value="infoCreateBoardSendRequest.id_workspace"
      placeholder="Chọn không gian làm việc"
  >
  </a-select>
  <a-divider orientation="left" class="divider-create-board">Tiêu đề</a-divider>
  <a-input
    placeholder="Nhập tiêu đề tối đa 25 ký tự"
    v-model:value="infoCreateBoardSendRequest.title_board"
    allow-clear
    show-count
    :maxlength="25"
  ></a-input>
  <a-divider orientation="left" class="divider-create-board">Chọn màu</a-divider>
  <a-flex wrap="wrap" gap="middle" style="width: 302px">
<!--   trong liên kết style i là biến sẽ chạy qua từng phần tử trong vòng lặp, và sẽ gọi thuộc tính
       của từng phần tử như bên dưới đã ghi, vấn đề là tuy không khai báo bất kỳ 1 dữ liệu nào
       liên quan đến thuộc tính bgcolor_name, vì đây là tên của cột trong cơ sở dữ liệu, có nghĩa là i
       đã đang là 1 đối tượng Proxy và có giá trị từ laravel gửi xuống rồi, chỉ là không có sự hiện diện
       trong ide nên nó không tìm thấy. Ta nên làm cho nó rõ ràng hơn và có khả năng dynamic tốt hơn.
-->
    <a-button
        class="new-board-background-color"
        :class="{'selected-board-background-color': isSelected === i.id_bgcolor}"
        v-for="(i,index) in dataBackgroundColor"
        :key="index"
        :style="{backgroundImage: i.bgcolor_name}"
        @click="isSelectedBackgroundColor(i.id_bgcolor,(index+1))"
    ></a-button>
  </a-flex>
  <a-divider orientation="left" class="divider-create-board"></a-divider>
  <a-flex justify="center">
    <a-button type="primary" @click="createBoard()">Đồng ý</a-button>
  </a-flex>
</div>
</template>

<style scoped>
.divider-create-board{
  font-size: 14px;
}
.new-board-background-color{
  width: 90px;
  height: 32px;
  border-radius: 8px;
  padding: 0 5px 0 5px;
  border: 1px ;
}
.new-board-background-color:hover{
  opacity: 0.5;
  cursor: pointer;
}
.selected-board-background-color{
  outline: solid rgba(0, 119, 255, 0.5) 2px;
  outline-offset: 2px;
}
.new-board-background-color:focus{
  outline: solid rgba(0, 119, 255, 0.5) 2px;
  outline-offset: 2px;
}
</style>