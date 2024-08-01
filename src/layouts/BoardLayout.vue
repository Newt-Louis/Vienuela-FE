<script setup>

import {
  StarOutlined,
  TeamOutlined,
  EllipsisOutlined,
  UserAddOutlined,
  FilterOutlined,
  RightOutlined,
  LeftOutlined, PlusOutlined
} from '@ant-design/icons-vue';
import Header from '../components/Header.vue'
import {computed,reactive, ref, watch} from "vue";
import ComponentList from "../components/boardcomponent/ComponentList.vue";
import {VueDraggableNext} from "vue-draggable-next";
import SideBar from "../components/SideBar.vue";
import {useRoute} from "vue-router";
import {useBoardStore} from "../store/crudboard.js";
import {useListStore} from "../store/cruddlist.js";

import {useMoveStore} from "../store/movefunctionstore/movedStore.js";

/*| Lưu ý đặc biệt khi sử dụng pinia: chỉ sử dụng bằng cách gọi store từ export
* | bên store đã khai báo vô trong 1 biến ở component muốn sử dụng, sau đó sử
* | dụng component đó xem như là instance của store đó ví dụ: lists = useListStore();
* | thì sử dụng : lists.listsStore hoặc phương thức lists.fetchLists() và sử dụng
* | computed trong store để tự động cập nhật dữ liệu dựa trên dữ liệu trong component
* | khi sử dụng như đã khai báo trên thì khi dữ liệu ở component được cập nhật thì
* | dữ liệu trong store cũng được cập nhật và dữ liệu được lưu trữ trong store không
* | mất đi dù có reload bao nhiêu lần.
* | Trường hợp lỗi đã phạm phải là khi khai báo các biến để sử dụng store lại khai báo
* | theo kiểu destructuring assignment là trích xuất các thuộc tính có trong 1 đối tượng
* | ra thành các biến khác mà những biến đó cùng tên với đối tượng, và những biến này sau
* | khi nhận giá trị ban đầu xong thì chúng hoạt động hoàn toàn độc lập nên trong trường
* | hợp ta muốn sử dụng nó để liên kết dữ liệu là không đúng như mong đợi.*/

/*-------------------------------------Khai báo biến----------------------------------*/
const lists = useListStore();
const board = useBoardStore();
const moved = useMoveStore();
const route = useRoute();
const draggable = VueDraggableNext;
const isAddedList = reactive({
  whenAdded: false,
  inputTitleList: '',
  inputStatus: computed(() => lists.stateListStore.isInputStatusNewList),
  dataError: computed(() => lists.stateListStore.dataErrorNewList),
});
const textHeaderBoardColor = ref('white');
const dragAttr = computed(() => {
  return {
    animation: 300,
    disabled: false,
    group: 'danhsach',
    ghostClass: 'style-back-ground-on-drag-list',
    class: 'style-on-drag-group'
  }
})
/*----------------------------Khai báo Function------------------------------------*/
/* Truy cập vào style của các component được đặt với các biến ref và thay đổi thuộc tính style trong nó
* sử dụng transition trong css để tạo hiệu ứng chuyển động mượt mỗi khi click*/

/*|  Tải board sau khi tạo component và render dữ liệu của board ra
* |  trong script setup thì không cần phải gọi lại các lifecycle hook
* |  beforeCreate hoặc created nữa vì script setup là đã đang sử dụng
* |  các hook đó rồi, chúng ta chỉ cần tạo biến và phương thức là sử
* |  dụng luôn.  */
      board.fetchBoard(route.params.id);
      lists.fetchLists(route.params.id);
/*const addAListInThisBoard = () => {
  let dataListToBeAdded = {
    idBoard: route.params.id,
    titleList: '',
  }
  listsStore.value.push(dataListToBeAdded);
  console.log(listsStore.value)
}*/
const addAListInThisBoard = async (title) => {
  let dataInfoList = reactive({
    idBoard: route.params.id,
    titleList: title,
  })
  await lists.addAListInThisBoard(dataInfoList);
  if (isAddedList.inputTitleList === ''){
    isAddedList.whenAdded = true;
  } else {
    isAddedList.whenAdded = false;
    isAddedList.inputTitleList = '';
  }
}


/*| ---------Chuyển động của side bar bên trái-----------  |
* |*/
const sidebarBoardLayout = ref();
const main = ref();
const moveButton = ref();
const onchangeButton = ref(true);
const openSideBar = () => {
  sidebarBoardLayout.value.style.width = "300px";
  main.value.style.marginLeft = "300px";
  moveButton.value.style.transform = 'translate(95%,-50%)';
}
const closeSideBar = () => {
  sidebarBoardLayout.value.style.width = "25px";
  main.value.style.marginLeft = "25px";
  moveButton.value.style.transform = 'translate(3%,-50%)'
}
watch(onchangeButton,(newVal) => {
  if (newVal){
    openSideBar();
  } else {
    closeSideBar();
  }
});
const onchangeButtonSideBarBoard = () => {
  onchangeButton.value = !onchangeButton.value;
}
const test = () => {
  console.log(board.boardStore);
  console.log(lists.listsStore);
}
const handleChange = async (item) => {
  // lấy các giá trị của đối tượng được drag
  let direction = item.moved;
  let newIndex = direction.newIndex;
  let oldIndex = direction.oldIndex;
  let dataPositionUpdated = [];
  /*vòng lặp sẽ kiểm tra giá trị trong khoảng thay đổi của đối tượng và thực hiện thay đổi giá trị
  * cho thuộc tính positionList trong khoảng mà đối tượng được kéo di chuyển.*/
  for (let i = Math.min(newIndex,oldIndex); i <= Math.max(newIndex,oldIndex); i ++){
    lists.listsStore[i].positionList = i+1;
  }
  dataPositionUpdated = lists.listsStore.map((item) => {
    return {
      idBoard: item.idBoard,
      idList: item.idList,
      positionList: item.positionList,
    }
  });
  /*sau đó gửi dữ liệu lên lại cho server cập nhật*/
  await moved.updatePositionList(dataPositionUpdated);
}
/*|-----------------------------------------------------------*/
</script>

<template>
  <div class="backgroundBoardLayout" :style="{backgroundImage: board.boardStore.bgcolorName}">
    <Header
      :background-color="board.boardStore.bgcolorName"
      :text-color="textHeaderBoardColor"
    />
    <div style="height: 66px"></div>
    <div class="headerBoardLayout" :style="{'--text-header-board-color': textHeaderBoardColor, }">
      <a-row align="middle" style="height: 70px">
        <a-col :xl="12" :md="12" :sm="12">
          <a-row align="middle">
            <a-col :span="8">
              <h1 style="margin: 0">{{board.boardStore.titleBoard}}</h1>
            </a-col>
            <a-col :span="2">
              <StarOutlined/>
            </a-col>
            <a-col :span="2">
              <TeamOutlined :style="{fontSize: '18px'}"/>
            </a-col>
          </a-row>
        </a-col>
        <a-col :xl="12" :md="12" :sm="12">
          <a-row justify="end">
            <a-col :span="4">
              <FilterOutlined/>
              Filter
            </a-col>
            <a-col :span="2">
              <UserAddOutlined/>
            </a-col>
            <a-col :span="2">
              <EllipsisOutlined/>
            </a-col>
            <a-col :span="4">
              <h3>Đổi tên</h3>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
<!--    Nội dung của BoardLayout-->
<div class="bodyBoardLayout">

<!--  Phần side bar bên trái-->
  <div ref="sidebarBoardLayout" class="sidebarstyle">
    <SideBar
      :text-sidebar-color="textHeaderBoardColor"
    ></SideBar>
  </div>
<!--  Nút đóng mở sidebar và di chuyển theo sidebar-->
  <div class="elementForButton" ref="moveButton">
    <a-button class="buttonToClick" @click="onchangeButtonSideBarBoard" shape="circle">
      <template v-if="onchangeButton">
        <LeftOutlined/>
      </template>
      <template v-else>
        <RightOutlined/>
      </template>
    </a-button>
  </div>
  <!-- Khung content của BoardLayout -->
  <div class="main" ref="main">
    <a-flex align="flex-start">
        <draggable
            v-model="lists.listsStore"
            v-bind="dragAttr"
            @change="handleChange"
        >
              <ComponentList
                  v-for="i in lists.listsStore"
                  :key="i.idList"
                  :id-list="i.idList"
                  :list-title="i.titleList"
              >
              </ComponentList>
        </draggable>

      <a-popover placement="rightTop" trigger="click" v-model:open="isAddedList.whenAdded">
        <template #title>Nhập tiêu đề</template>
        <template #content>
          <a-input
              placeholder="Nhập tiêu đề cho danh sách"
              v-model:value="isAddedList.inputTitleList"
              :status="isAddedList.inputStatus"
              :maxlength="36"
              allow-clear
              show-count
              style="width: 300px"
              @pressEnter="addAListInThisBoard(isAddedList.inputTitleList)"
          />
          <br/>
          <a-typography-text v-if="isAddedList.dataError.titleList" type="danger">
            {{isAddedList.dataError.titleList[0]}}
          </a-typography-text>
          <br/>
          <a-button
              @click="addAListInThisBoard(isAddedList.inputTitleList)"
              type="primary"
              class="button-add-list"
          >Ok</a-button>
        </template>
        <div class="button-open-add-list">
          <PlusOutlined/>
          Thêm danh sách mới
        </div>
      </a-popover>
    </a-flex>
  </div>
</div>


  </div>
</template>

<style scoped>
:root{
  --text-header-board-color: white
}
.style-back-ground-on-drag-list{
  border-radius: 8px;
  color: transparent;
}
.style-on-drag-group{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: start;
}
.button-add-list{
  text-align: center;
  margin-top: 5px;
  position: relative;
  right: -40%;
}
.button-open-add-list{
  border-radius: 10px;
  background-color: #e0e0e0;
  width: 250px;
  padding: 10px 15px 10px 15px;
  margin-right: 20px;
  cursor: pointer;
  font-size: 18px;
}
.button-open-add-list:hover{
  background-color: #cecece;
  border-radius: 8px;
}
.button-open-add-list:active{
  background-color: #afafaf;
}
/*.backgroundBoardLayout{
  height: 100vh;
}*/
.headerBoardLayout{
  padding: 0 40px 0 40px;
  color: var(--text-header-board-color);
}
/*.bodyBoardLayout{
  position: relative;
  height: 100vh;
}*/
/* The side navigation menu */
.sidebarstyle {
  height: 100%;
  width: 300px;
  position: absolute;
  background-color: transparent;
  overflow-x: hidden; /* Ẩn nội dung trong thanh cuộn ngang */
  padding-top: 60px;
  transition: all 0.5s ease;
  border-right: 1px solid white;
}
/* Position and style the close button (top right corner) */
.elementForButton {
  width: 300px;
  position: absolute;
  transform: translate(95%,-50%);
  transition: 0.5s;
}
.elementForButton .buttonToClick{
  background-color: rgba(255, 255, 255);
  color: #000000;
  font-size: 14px;
}
.main {
  transition: margin-left .5s;
  margin-left: 300px;
  padding: 20px;
  overflow-x: auto;
  white-space: nowrap;
  height: 100vh;
}
</style>