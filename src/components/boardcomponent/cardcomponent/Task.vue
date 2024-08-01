<script setup>
import {CloseCircleOutlined} from "@ant-design/icons-vue";
import {computed, reactive, ref, watchEffect} from "vue";
import {useCheckListsStore} from "../../../store/cardfunctionstore/checkListsStore.js";
import {notification} from "ant-design-vue";


const useCheckListStore = useCheckListsStore();
const props = defineProps({
  idChecklist: '',
  taskInCheckList: Array,
})
const statusTaskAdded = reactive({
  isAdded: false,
  statusInputTaskDescript: '',
  dataErrorInputTask: {},
  valueInputDescriptTask: '',
})
const tasks = ref([]);
watchEffect(() => {
  tasks.value = props.taskInCheckList.map(item => {
    let newItem = {...item};
    newItem.idTask = newItem.id_task;
    delete newItem.id_task;
    newItem.idChecklist = newItem.id_checklist;
    delete newItem.id_checklist;
    newItem.titleTask = newItem.description;
    delete newItem.description;
    newItem.isChecked = newItem.is_checked !== 0;
    delete newItem.is_checked;
    return newItem;
  });
});
const addNewTask = async (titleTask) => {
  let dataToAddTask = {
    idChecklist: props.idChecklist,
    titleTask: titleTask,
    checked: false,
  }
  await axios.post('http://127.0.0.1:8000/api/checklist/add_task',dataToAddTask)
      .then((response) => {
        useCheckListStore.fetchCheckListInThisCard(response.data.id_card);
        statusTaskAdded.statusInputTaskDescript = '';
        statusTaskAdded.dataErrorInputTask = {};
        statusTaskAdded.valueInputDescriptTask = '';
        statusTaskAdded.isAdded = false;
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        statusTaskAdded.statusInputTaskDescript = 'error';
        statusTaskAdded.dataErrorInputTask = error.response.data.errors;
        statusTaskAdded.isAdded = true;
      })
}
const deleteTaskInThisList = async (idTask) => {
  await axios.post('http://127.0.0.1:8000/api/checklist/soft_delete_task/'+idTask)
  .then((response) => {
    useCheckListStore.fetchCheckListInThisCard(response.data.id_card);
  })
      .catch((error) => {
        console.log(error.response)
        notification.error({
          message: 'Có lỗi xảy ra với máy chủ',
          description: error.response.data.message,
          placement: "topRight",
        })
      })
}
const updateCheckedOnServer = async (idTask,isCheck) => {
  let dataToChangeChecked = {
    idTask: idTask,
    isChecked: isCheck,
  }
    await axios.post('http://127.0.0.1:8000/api/checklist/update_task_checked', dataToChangeChecked)
      .then((response) => {
        useCheckListStore.fetchCheckListInThisCard(response.data.id_card);
      })
      .catch((error) => {
        notification.error({
          message: 'Có lỗi xảy ra với máy chủ',
          description: error.response.data.message,
          placement: "topRight",
        })
      })
}
const checkListPercent = computed(() => {
  const checkedCount = tasks.value.filter(box => box.isChecked).length;
  return Number(((checkedCount / tasks.value.length) * 100).toFixed(2));
});
const test = () => {
  console.log(tasks.value);
}
</script>

<template>
<div>
  <a-progress :percent="checkListPercent"/>
  <a-row :gutter="[0,8]" style="margin-bottom: 10px">
    <a-col :span="6" v-for="(item,index) in tasks" class="task-checkbox">
      <a-checkbox
          @change="updateCheckedOnServer(item.idTask,item.isChecked)"
          v-model:checked="item.isChecked"
          style="padding: 5px 4px 0 4px"
      >
        {{ item.titleTask }}
      </a-checkbox>
      <a-button type="text" class="task-delete-button" @click="deleteTaskInThisList(item.idTask)">
        <CloseCircleOutlined/>
      </a-button>
    </a-col>
  </a-row>
  <a-flex>
    <a-popover placement="rightTop" trigger="click" v-model:open="statusTaskAdded.isAdded">
      <template #content>
        <a-input
            placeholder="Nhập tiêu đề cho nhiệm vụ"
            :maxlength="25"
            allow-clear
            show-count
            style="width: 300px"
            :status="statusTaskAdded.statusInputTaskDescript"
            v-model:value="statusTaskAdded.valueInputDescriptTask"
            @pressEnter="addNewTask(statusTaskAdded.valueInputDescriptTask)"
        ></a-input>
        <br/>
        <a-typography-paragraph
            style="margin: 0"
            v-if="statusTaskAdded.dataErrorInputTask.titleTask" type="danger">
          {{statusTaskAdded.dataErrorInputTask.titleTask[0]}}
        </a-typography-paragraph>
        <a-button
            style="margin-top: 10px"
            @click="addNewTask(statusTaskAdded.valueInputDescriptTask)"
            type="primary">
          Thêm mới
        </a-button>
      </template>
    <a-button type="text" class="list-button-add-delete">Thêm nhiệm vụ</a-button>
    </a-popover>
  </a-flex>
</div>
</template>

<style scoped>
.task-delete-button{
  float: right;
  display: none;
  border: none;
}
.task-checkbox{
  height: 32px;
  padding-left: 16px;
}
.task-checkbox:hover{
  background-color: #dcdcdc;
  border-radius: 8px;
}
.task-checkbox:hover .task-delete-button{
  display: block;
}
.list-button-add-delete{
  background-color: gainsboro;
}
</style>