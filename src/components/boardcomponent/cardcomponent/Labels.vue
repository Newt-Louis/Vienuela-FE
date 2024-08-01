<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {PlusOutlined,TagOutlined,DeleteOutlined,CloseOutlined} from "@ant-design/icons-vue";
import {notification} from "ant-design-vue";
import {useLabelsStore} from "../../../store/cardfunctionstore/labelsStore.js";

const props = defineProps({
  idCard : '',
})
const labelsStore = useLabelsStore();
const dataLabelsOrigin = ref([]);
const labelsBelongToThisCard = computed(() => labelsStore.labelsOfCard[props.idCard]);
const dataStatusLabelsAction = reactive({
  isDeleted: false,
  whenLabelAdded: false,
  idCard: '',
  idColor: '',
  shortTitle: '',
  isInputStatusAddLabel: computed(() => labelsStore.stateLabelsCard.statusAddNewLabel),
  dataErrorInputAddLabel: computed(() => labelsStore.stateLabelsCard.dataErrorAddNewLabel)
})
labelsStore.fetchLabelsInThisCard(props.idCard);
const getLabelsOrigin = async () => {
  await axios.get('http://127.0.0.1:8000/api/label/view')
    .then((response) => {
      dataLabelsOrigin.value = response.data.map((item)=>{
        return {
          idColor: item.id_color,
          colorName: item.color_name,
        }
      });
    })
    .catch((error) => {
      notification.error({
        message: 'Lỗi kết nối với máy chủ, vui lòng thử lại !',
        description: error.response.data.message,
        placement: 'topRight',
      })
    })
}
const addALabelToThisCard = async (titleLabel) => {
  let dataInfoLabelToAdd = {
    idCard: props.idCard,
    idLabelColor: dataStatusLabelsAction.idColor,
    shortTitle: titleLabel,
  }
  await labelsStore.addALabelsToThisCard(dataInfoLabelToAdd);
  if (dataStatusLabelsAction.idColor === ''){
    dataStatusLabelsAction.whenLabelAdded = true;
  } else {
    dataStatusLabelsAction.whenLabelAdded = false;
    dataStatusLabelsAction.shortTitle = '';
    dataStatusLabelsAction.idColor = '';
  }
}
const updateTitleLabel = async (titleToUpdate,colorId) => {
  let dataUpdateTitle = {
    idCard: props.idCard,
    titleLabelUpdate: titleToUpdate,
    idColor:colorId,
  }
  await labelsStore.updateTitleOfLabelsInThisCard(dataUpdateTitle);
  console.log(labelsStore.labelsOfCard)
}
const softDeletedALabel = async (idCard,idColor) => {
  let dataDeleteLabel = {
    idCard: idCard,
    idColor: idColor,
  }
  await labelsStore.softDeleteLabelInThisCard(dataDeleteLabel);
}
const selectColor = (idcolor) => {
  dataStatusLabelsAction.idColor = idcolor;
}
</script>

<template>
  <div>
    <a-flex justify="space-between" style="margin-bottom: 10px">
      <div>
        <a-typography-title :level="5">
          <TagOutlined class="icon-title-scaffold"/>Dán nhãn/tem
        </a-typography-title>
      </div>
      <div style="margin-right: 30px">
        <a-button type="text" size="small" @click="() => dataStatusLabelsAction.isDeleted = !dataStatusLabelsAction.isDeleted">
          <a-typography-text>Xóa</a-typography-text>
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </div>
    </a-flex>
    <a-flex wrap="wrap" gap="small">
      <div v-for="i in labelsBelongToThisCard" style="position: relative">
        <button
          class="icon-delete-labels"
          @click="softDeletedALabel(props.idCard,i.idColor)"
          v-if="dataStatusLabelsAction.isDeleted"
        >
          <CloseOutlined/>
        </button>
          <input
            :style="{backgroundColor: i.labelColor, border: '2px dashed ' + i.labelColor}"
            :id="i.idColor"
            class="label"
            type="text"
            v-model="i.shortTitle"
            maxlength="10"
            @keyup.enter="updateTitleLabel(i.shortTitle,i.idColor)"
            @blur="updateTitleLabel(i.shortTitle,i.idColor)"
          >
      </div>
      <!--                    Nút sự kiện thêm label, thêm labels sẽ là 1 component con-->
      <a-tooltip placement="bottom" color="purple">
        <template #title>Thêm nhãn dán</template>
        <a-popover placement="rightTop" trigger="click" v-model:open="dataStatusLabelsAction.whenLabelAdded">
          <template #title>
            <span>Thêm nhãn/tem dán mới</span>
          </template>
          <template #content>
            <a-divider style="font-size: 14px" orientation="left">Nhập tiêu đề</a-divider>
            <a-input
                placeholder="Nhập tiêu đề"
                :maxlength="10"
                v-model:value="dataStatusLabelsAction.shortTitle"
                allow-clear
                show-count
            ></a-input>
            <br/>
            <a-typography-text v-if="dataStatusLabelsAction.dataErrorInputAddLabel.idLabelColor" type="danger">
              {{dataStatusLabelsAction.dataErrorInputAddLabel.idLabelColor[0]}}
            </a-typography-text>
            <a-divider style="font-size: 14px" orientation="left">Chọn màu</a-divider>
            <a-flex wrap="wrap" gap="middle" style="width: 302px">
              <a-button
                  class="new-label"
                  v-for="i in dataLabelsOrigin"
                  :id="i.idColor"
                  :style="{backgroundColor: i.colorName}"
                  @click="selectColor(i.idColor)"
              ></a-button>
            </a-flex>
              <a-button
                  type="primary"
                  style="margin-top: 16px; position: relative; left: 110px;"
                  @click="addALabelToThisCard(dataStatusLabelsAction.shortTitle)"
              >Tạo mới</a-button>
          </template>
          <a-button @click="getLabelsOrigin">
            <template #icon>
              <PlusOutlined/>
            </template>
          </a-button>
        </a-popover>
      </a-tooltip>
    </a-flex>
  </div>
</template>

<style scoped>
.label{
  color: white;
  width: 90px;
  height: 32px;
  border-radius: 8px;
  padding: 0 5px 0 5px;
  border: 1px ;
}
.label:focus{
  outline: none;
  background-color: white !important;
  color: black;
}
.label:hover{
  opacity: 0.5;
  cursor: pointer;
}
.icon-title-scaffold{
  font-size: 20px;
  margin-right: 10px;
}
.new-label{
  width: 90px;
  height: 32px;
  border-radius: 8px;
  padding: 0 5px 0 5px;
  border: 1px ;
}
.new-label:hover{
  opacity: 0.5;
  cursor: pointer;
}
.new-label:focus{
  outline: solid rgba(0, 119, 255, 0.5) 2px;
  outline-offset: 2px;
}
.icon-delete-labels{
  background-color: red;
  color: white;
  border: 0.5px solid red;
  font-size: 10px;
  padding: 0;
  width: 17px;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  right: -7px;
}
.icon-delete-labels:hover {
  background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
  border-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
</style>