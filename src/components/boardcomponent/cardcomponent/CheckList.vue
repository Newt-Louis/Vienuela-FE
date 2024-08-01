<script setup>
import {computed, reactive, ref} from "vue";
import {CloseCircleOutlined} from "@ant-design/icons-vue";
import {useCheckListsStore} from "../../../store/cardfunctionstore/checkListsStore.js";
import Task from "./Task.vue";

const props = defineProps({
  idCard: '',
})
const useChecklist = useCheckListsStore();
const checklistThisCard = computed(() => useChecklist.checkListsStore[props.idCard])
const statusLocalCheckList = reactive({
  isDeleteActive: false,
  inputNewTitleCheckList: '',
  isCheckListAdded: false,
})
const addANewCheckListInThisCard = async (titleCheckList) => {
  let dataToAddCheckList = {
    idCard: props.idCard,
    titleCheckList: titleCheckList,
  }
  await useChecklist.createNewCheckListInThisCard(dataToAddCheckList);
  statusLocalCheckList.inputNewTitleCheckList = '';
  statusLocalCheckList.isCheckListAdded = false;
}
const softDeleteThisCheckList = async (idChecklist,idCard) => {
  let dataToDelete = {
    idChecklist: idChecklist,
    idCard: idCard,
  }
  await useChecklist.softDeleteCheckListInThisCard(dataToDelete);
}
</script>

<template>
<div>
  <a-flex justify="space-between">
    <a-flex>
      <i class="fa-solid fa-list-check icon-title-scaffold"></i>
      <a-typography-title :level="5">Danh sách nhiệm vụ</a-typography-title>
    </a-flex>
    <a-flex>
      <a-button type="primary" danger @click="() => statusLocalCheckList.isDeleteActive = !statusLocalCheckList.isDeleteActive">Xóa danh sách nhiệm vụ</a-button>
    </a-flex>
    <a-flex>
      <a-popover placement="leftTop" v-model:open="statusLocalCheckList.isCheckListAdded">
        <template #title>Nhập tiêu đề danh sách nhiệm vụ</template>
        <template #content>
          <a-input
              placeholder="Nhập tiêu đề...."
              allow-clear
              :maxlength="25"
              show-count
              style="width: 300px"
              v-model:value="statusLocalCheckList.inputNewTitleCheckList"
              @pressEnter="addANewCheckListInThisCard(statusLocalCheckList.inputNewTitleCheckList)"
          >
          </a-input>
          <br/>
          <a-typography-text type="secondary">Có thể bỏ qua nếu không muốn đặt tên</a-typography-text>
          <br/>
          <a-typography-text type="secondary" strong>Nhấp vào nút đồng ý để tạo mới 1 danh sách</a-typography-text>
          <br/>
          <a-button
            type="primary"
            style="margin-top: 10px"
            @click="addANewCheckListInThisCard(statusLocalCheckList.inputNewTitleCheckList)"
          >
            Đồng ý
          </a-button>
        </template>
        <a-button
            type="primary"
        >Thêm danh sách nhiệm vụ
        </a-button>
      </a-popover>
    </a-flex>
  </a-flex>
  <div class="checklist-scaffold" v-for="(item, index) in checklistThisCard" :key="index">
    <a-divider></a-divider>
    <a-typography-title :level="5" type="secondary">{{item.titleCheckList}}</a-typography-title>
    <Task :id-checklist="item.idChecklist" :task-in-check-list="item.tasks"></Task>
    <a-popconfirm
        title="Bạn có muốn xóa danh sách này ?"
        ok-text="Đồng ý"
        cancel-text="Không"
        @confirm="softDeleteThisCheckList(item.idChecklist,item.idCard)"
        placement="left"
    >
      <a-button
          v-if="statusLocalCheckList.isDeleteActive"
          class="button-delete-checklist"
      >
        Xóa danh sách {{ item.titleCheckList }}
      </a-button>
    </a-popconfirm>
  </div>
</div>
</template>

<style scoped>
.button-delete-checklist{
  float: right;
  bottom: 32px;
}
.checklist-scaffold{
  margin-bottom: 32px;
}
.icon-title-scaffold{
  font-size: 20px;
  margin-right: 10px;
}
</style>