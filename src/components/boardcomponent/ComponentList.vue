<script setup>
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import {ref, reactive, computed, nextTick} from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import ComponentCard from "./ComponentCard.vue";
import {useCardStore} from "../../store/crudcard.js";
import {useListStore} from "../../store/cruddlist.js";
import {useMoveStore} from "../../store/movefunctionstore/movedStore.js";

const props = defineProps({
  listTitle: '',
  idList: '',
})
const lists = useListStore();
const cards = useCardStore();
// Dữ liệu của 1 mảng cards của id list tương ứng với component này.
const dataCardsOfThisList = computed(() =>  cards.cardsStore[props.idList]);
// Biến isAddedCard xử lý trạng thái khi thêm card mới
const isAddedCard = reactive({
  whenCardAdded: false,
  inputTitleCard: '',
  inputStatus: computed(() => cards.stateCardStore.isInputStatusNewCard) ,
  dataErrorAddNewCard: computed(() => cards.stateCardStore.dataErrorNewCard) ,
});
// Biến dataInputUpdatedTitleList xử lý trạng thái khi update title của list
const dataInputUpdatedTitleList = reactive({
  whenUpdatedTitleList: false,
  inputNewTitleList: '',
  inputNewTitleListStatus: computed(() => lists.stateListStore.isInputStatusUpdateTitleList),
  dataErrorUpdatedTitleList: computed(() => lists.stateListStore.dataErrorUpdatedTitleList),
});

/*Biến draggable & dragAttr để tạo đối tượng kéo thả và xử lý animation + css khi kéo,
 thuộc tính group để nhóm các mảng cần hoạt động kéo.*/
const draggable = VueDraggableNext;
const dragAttr = computed(() => {
  return {
    animation: 300,
    disabled: false,
    group: 'nhiemvu',
    ghostClass: 'styleBackGroundOnDragCard',
  }
})

// Fetch dữ liệu của cards trong danh sách với id tương ứng ngay khi component được tạo.
cards.fetchCardsViewInList(props.idList);
// Function update title cho list
const renameTitleThisList = async (newTitleList) => {
  let dataRenameTitleList = reactive({
    idList: props.idList,
    titleList: newTitleList,
  })
  await lists.renameThisList(dataRenameTitleList);
  if (dataInputUpdatedTitleList.inputNewTitleList === ''){
    dataInputUpdatedTitleList.whenUpdatedTitleList = true;
  } else {
    dataInputUpdatedTitleList.whenUpdatedTitleList = false;
    dataInputUpdatedTitleList.inputNewTitleList = '';
  }
}
// Thêm thẻ mới
const addACardIntoThisList = async (titleCard) => {
  let dataCardAdded = reactive({
    idList: props.idList,
    titleCard: titleCard,
  })
  await cards.addCardIntoList(dataCardAdded);
  if (isAddedCard.inputTitleCard === ''){
    isAddedCard.whenCardAdded = true;
  } else {
    isAddedCard.inputTitleCard = '';
    isAddedCard.whenCardAdded = false;
  }
}
// Function xóa list bằng softDeletes()
const confirmSoftDeleteThisList = idList => {
  lists.softDeleteThisListById(idList);
};
/*Biến kiểm tra danh sách nơi card có tiềm năng được thả hoặc không nhờ vào sự kiện move mà lấy được id của danh sách
* liên quan tương ứng để kiểm soát xem thực hiện thay đổi trong cùng 1 list hay là khác list*/
const moveStores = useMoveStore();
const handleChange = async (item) => {
  if (item.hasOwnProperty('moved')){
    moveStores.dataUpdatedCardMovedInList = cards.cardsStore[props.idList];
  } else {
    if (item.removed){
      moveStores.instanceCardChangeList = item.removed.element;
    }
  }
}
const handleEnd = (item) => {
  if (moveStores.defineIdList === props.idList){
    moveStores.updatePositionCardInList(item.newIndex,item.oldIndex);
  } else {
    moveStores.updatePositionCardChangeList(item.newIndex,item.oldIndex,props.idList);
  }
}
const handleDrag = (item) => {
  let futureIndex = item.draggedContext.futureIndex;
  let listLength = item.relatedContext.list.length;
  if (futureIndex === 0){
    moveStores.defineIdList = item.relatedContext.list[listLength - 1].idList;
  } else if (futureIndex === listLength) {
    moveStores.defineIdList = item.relatedContext.list[0].idList;
  } else {
    moveStores.defineIdList = item.relatedContext.list[0].idList;
  }
}
</script>
<template>
    <div class="listlayout ">
      <div class="listHeader">
        <div style="max-width: 200px; white-space: normal">
          {{listTitle}}
        </div>
        <a-popover placement="rightTop" trigger="click">
          <template #content>
            <div class="layout-content-list-edit">
              <a-popover placement="rightTop" trigger="click" v-model:open="dataInputUpdatedTitleList.whenUpdatedTitleList">
                <template #title>Nhập tiêu đề danh sách</template>
                <template #content>
                  <a-input
                      placeholder="Nhập tiêu đề cho danh sách..."
                      :maxlength="25"
                      allow-clear
                      show-count
                      :status="dataInputUpdatedTitleList.inputNewTitleListStatus"
                      v-model:value="dataInputUpdatedTitleList.inputNewTitleList"
                      @pressEnter="renameTitleThisList(dataInputUpdatedTitleList.inputNewTitleList)"
                  />
                  <br/>
                  <a-typography-text v-if="dataInputUpdatedTitleList.dataErrorUpdatedTitleList.titleList" type="danger">
                    {{dataInputUpdatedTitleList.dataErrorUpdatedTitleList.titleList[0]}}
                  </a-typography-text>
                  <br/>
                  <a-button
                      @click="renameTitleThisList(dataInputUpdatedTitleList.inputNewTitleList)"
                      type="primary"
                      style="margin-top: 10px;"
                  >Đồng ý</a-button>
                </template>
              <div class="list-lists-edit"><EditOutlined /> Sửa tiêu đề</div>
              </a-popover>
              <a-popconfirm
                  title="Bạn có chắc muốn xóa danh sách này?"
                  ok-text="Đồng ý"
                  cancel-text="Không xóa"
                  @confirm="confirmSoftDeleteThisList(props.idList)"
                  placement="right"
              >
              <div class="list-lists-edit"><DeleteOutlined /> Xóa danh sách này</div>
              </a-popconfirm>
              <a-popover placement="rightTop" trigger="click">
                <template #title>Chọn điểm đến</template>
                <template #content>
                  <a-divider orientation="left">
                    <a-typography-text type="secondary">Chọn Bảng cần đến</a-typography-text>
                  </a-divider>
                  <a-select
                      ref="select"
                      style="width : 200px"
                  ></a-select>
                  <br/>
                  <a-button type="primary" style="margin-top: 20px">Đồng ý</a-button>
                </template>
              <div class="list-lists-edit"><ArrowRightOutlined /> Di chuyển</div>
              </a-popover>
            </div>
          </template>
          <button>
            <EllipsisOutlined></EllipsisOutlined>
          </button>
        </a-popover>
      </div>
      <div class="listBody">
        <draggable
            :list="cards.cardsStore[props.idList]"
            v-bind="dragAttr"
            @end="handleEnd"
            @change="handleChange"
            :move="handleDrag"
        >
          <transition-group name="danh-sach1">
            <ComponentCard
              class="cardInList"
              v-for="(i,index) in dataCardsOfThisList"
              :key="index"
              :id-card="i.idCard"
              :title-card="i.titleCard"
            >
              <template #cardTitle>{{i.titleCard}}</template>
            </ComponentCard>
          </transition-group>
        </draggable>
      </div>
      <div class="listFooter">
        <a-popover placement="rightTop" trigger="click" v-model:open="isAddedCard.whenCardAdded">
          <template #title>Nhập tiêu đề</template>
          <template #content>
            <a-input
              placeholder="Nhập tiêu đề cho thẻ"
              v-model:value="isAddedCard.inputTitleCard"
              :status="isAddedCard.inputStatus"
              :maxlength="25"
              allow-clear
              show-count
              style="width: 300px"
              @pressEnter="addACardIntoThisList(isAddedCard.inputTitleCard)"
            />
            <br/>
            <a-typography-paragraph
                style="margin: 0"
                v-if="isAddedCard.dataErrorAddNewCard.titleCard" type="danger"
            >
              {{isAddedCard.dataErrorAddNewCard.titleCard[0]}}
            </a-typography-paragraph>
            <a-button
                @click="addACardIntoThisList(isAddedCard.inputTitleCard)"
                type="primary"
                style="margin-top: 10px"
            >Đồng ý</a-button>
          </template>
          <button>
            <PlusOutlined/> Thêm thẻ mới
          </button>
        </a-popover>
      </div>
    </div>

</template>
<style>
.styleBackGroundOnDragCard {
  border-radius: 8px;
  color: transparent;
  background-color: rgba(130, 130, 130, 0.5) !important;
}
.danh-sach1-move {
  transition: translate 0.5s ease-out;
}
.list-lists-edit{
  margin-bottom: 10px;
  padding: 10px;
}
.list-lists-edit:hover{
  cursor: pointer;
  background-color: #cecece;
  border-radius: 8px;
}
.list-lists-edit:last-child{
  margin-bottom: 0;
}
.listlayout{
  border-radius: 10px;
  background-color: #e0e0e0;
  width: 280px;
  padding: 10px 15px 15px 15px;
  margin-right: 20px;
}
.listHeader{
  display: flex;
  justify-content: space-between;
  height: 36px;
  align-items: center;
  font-size: 18px;
}
.listHeader button{
  font-size: 24px;
  border: none;
  background-color: transparent;
  padding: 3.5px 6px 1px 5.5px;
  width: 35px;
  height: 35px;
}
.listHeader button:hover{
  background-color: #cecece;
  border-radius: 8px;
  cursor: pointer;
}
.listHeader button:active{
  background-color: #afafaf;
}
.cardInList{
  border-radius: 8px;
  padding: 10px;
  margin-top: 15px;
  background-color: white;
}
.cardInList:hover{
  box-shadow: 3px 3px 5px rgba(180, 180, 180, 0.8);
  cursor: pointer;
}
.listFooter{
  margin-top: 10px;
  width: 100%;
  height: 36px;
}
.listFooter button{
  padding: 2px 8px 2px 8px;
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 18px;
  margin-top: 7px;
  cursor: pointer;
}
.listFooter:hover{
  background-color: #cecece;
  border-radius: 8px;
  height: 36px;
  cursor: pointer;
}
.listFooter:active{
  background-color: #afafaf;
}
</style>