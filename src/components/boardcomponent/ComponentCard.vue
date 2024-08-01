<script setup>
/*------------------------------------Imports-----------------------------------*/
import {
  PaperClipOutlined,
  UserOutlined,
  TagOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  CopyOutlined,
  ArrowRightOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import {ref, computed, watch, onMounted, watchEffect, reactive} from 'vue';
import {AddMembers,CheckList,DueDate,Labels,Upload} from "./cardcomponent";
import {useCardStore} from "../../store/crudcard.js";
import {useListStore} from "../../store/cruddlist.js";
import {useCardLogic} from "../../composable/cardComposableLogic.js";
import {useCardFunctionLogic} from "../../composable/cardFunctionComposableLogic.js";
import {useDueDatesStore} from "../../store/cardfunctionstore/dueDateStore.js";
import {useCheckListsStore} from "../../store/cardfunctionstore/checkListsStore.js";
import {useLabelsStore} from "../../store/cardfunctionstore/labelsStore.js";
import dayjs from "dayjs";

/*------------------------------------Variables---------------------------------*/
const props = defineProps({
  idCard: '',
  titleCard: '',
});
const cards = useCardStore();
const lists = useListStore();
const useDueDateStore = useDueDatesStore();
const useCheckListStore = useCheckListsStore();
const useLabelStore = useLabelsStore();

let getInstanceDueDateThisCard = computed(() => useDueDateStore.cardsDueDateStore[props.idCard]);
let getInstanceLabelsThisCard = computed(() => useLabelStore.labelsOfCard[props.idCard]);
let getInstanceChecklistThisCard = computed(() => useCheckListStore.checkListsStore[props.idCard]);

const getLabelsCardLimit3 = ref([]);
const getNumbersChecklistThisCardHave = ref(0);
const stateOfDueDateInThisCard = reactive({
  isDueDateBeingSet: false,
  getColorOutlineDueDate: 'none',
  dueDateSetTime: '',
  whenDueDateOfThisCardIsDone: false,
})


useDueDateStore.fetchDueDateWhenCardHave(props.idCard);
useCheckListStore.fetchCheckListInThisCard(props.idCard);
useLabelStore.fetchLabelsInThisCard(props.idCard);

const {
  isAddButton,
  isUpdateInputTitleCard,
  modalVisible,
  renameTitleThisCard,
  setModalVisible,
  confirmSoftDelete,
} = useCardLogic(props);
const {
  descriptionText,
  fetchDescriptionCard,
  updateDescription,
  fetchFilesThisCardHave,
  getNotifyDueDateOfThisCard,
  getLabelsOfThisCard,
  getCheckListOfThisCard,
} = useCardFunctionLogic(props);

watch(getInstanceChecklistThisCard,(newVal, oldVal) => {
  if (newVal){
    getNumbersChecklistThisCardHave.value = getCheckListOfThisCard(newVal);
  }
})
watch(getInstanceDueDateThisCard, (newVal,oldVal) => {
  if (newVal) {
    if (newVal.dueDate === null) {
      stateOfDueDateInThisCard.isDueDateBeingSet = false;
    } else {
      stateOfDueDateInThisCard.isDueDateBeingSet = true;
      stateOfDueDateInThisCard.whenDueDateOfThisCardIsDone = newVal.isDueDateDone;
      stateOfDueDateInThisCard.getColorOutlineDueDate = getNotifyDueDateOfThisCard(newVal).getColorOutlineDueDate;
      stateOfDueDateInThisCard.dueDateSetTime = dayjs(getNotifyDueDateOfThisCard(newVal).dueDateSetTime).format('DD-MM-YYYY HH:mm');
    }
  }
},
    {immediate:true},
)
watch(getInstanceLabelsThisCard, (newVal,oldVal) => {
  if (newVal) {
    getLabelsCardLimit3.value = getLabelsOfThisCard(newVal);
  }
})
const searchPersons = ref();
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];
   const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
const province = ref(provinceData[0]);
const secondCity = ref(cityData[province.value][0]);
const cities = computed(() => {
  return cityData[province.value];
});
watch(province, val => {
  secondCity.value = cityData[val][0];
});
const onSearch = (event) => {
  console.log(event);
}
/*Mỗi khi mở Modal lên thì mới fetch dữ liệu có trong Card, giúp giao diện đạt được hiệu suất nhanh hơn so với
* việc mỗi khi 1 component card được tạo ra thì phải chạy hết dữ liệu một lần. Watch trong component card chỗ này sẽ
* theo dõi biến modalVisible trên mỗi card để thực hiện các phương thức có bên trong nó, toàn bộ phương thức
* bất đồng bộ giờ sẽ được chuyển hết qua các file composable, và trong watch chỉ gọi phương thức để chạy. */
watch(modalVisible,(newVal,oldVal) => {
  if (newVal) {
    fetchDescriptionCard();
    fetchFilesThisCardHave();
  }
})
/*------------------------------------------------------------------------------------------------*/

</script>

<template>
  <div class="scaffold-of-card" :style="{'--duedate-outline-card' : stateOfDueDateInThisCard.getColorOutlineDueDate}">
      <div class="card-in-list" @click="setModalVisible">
        <a-flex gap="small">
          <div
              v-for="(i,index) in getLabelsCardLimit3"
              :style="{'--color-mini-labels' : i.labelColor}"
              class="mini-labels-of-card"
          ></div>
        </a-flex>
        <a-typography-title :level="5" style="margin: 5px 0 5px 0">
          <slot name="cardTitle"><{Card Title}</slot>
        </a-typography-title>
        <a-flex justify="space-around">
          <div v-if="stateOfDueDateInThisCard.isDueDateBeingSet">
            <a-tooltip placement="bottom" color="#f50">
              <template #title>
                <a-typography-text style="color: white" strong>
                  Thời gian hết hạn: <br/>
                  {{ stateOfDueDateInThisCard.dueDateSetTime }}
                </a-typography-text>
              </template>
              <ClockCircleOutlined/>
            </a-tooltip>
          </div>
          <div v-if="getNumbersChecklistThisCardHave !== 0">
            <a-tooltip placement="bottom" color="#f50">
              <template #title>
                <a-typography-text style="color: white" strong>
                  Đang có {{ getNumbersChecklistThisCardHave }} danh sách nhiệm vụ
                </a-typography-text>
              </template>
              <i class="fa-solid fa-list-check"></i>
            </a-tooltip>
          </div>
        </a-flex>
      </div>
      <div>
        <a-popover placement="rightTop" trigger="click">
          <template #content>
            <div class="layout-content-card-edit">
              <a-popover placement="rightTop" trigger="click"
                         v-model:open="isUpdateInputTitleCard.whenTitleCardUpdated">
                <template #title>Nhập tiêu đề</template>
                <template #content>
                  <a-input
                      placeholder="Nhập tiêu đề cho thẻ"
                      :maxlength="25"
                      v-model:value="isUpdateInputTitleCard.inputTitleCard"
                      :status="isUpdateInputTitleCard.inputStatusUpdateTitleCard"
                      allow-clear
                      show-count
                      style="width: 300px"
                      @pressEnter="renameTitleThisCard(isUpdateInputTitleCard.inputTitleCard)"
                  />
                  <br/>
                  <a-typography-paragraph
                      style="margin: 0"
                      v-if="isUpdateInputTitleCard.dataErrorUpdateTitleCard.titleCard" type="danger">
                    {{ isUpdateInputTitleCard.dataErrorUpdateTitleCard.titleCard[0] }}
                  </a-typography-paragraph>
                  <a-button
                      @click="renameTitleThisCard(isUpdateInputTitleCard.inputTitleCard)"
                      type="primary"
                      style="margin-top: 10px"
                  >Đồng ý
                  </a-button>
                </template>
                <div class="list-card-edit">
                  <EditOutlined/>
                  Sửa tiêu đề
                </div>
              </a-popover>
              <a-popconfirm
                  title="Bạn có chắc muốn xóa thẻ này không ?"
                  ok-text="Đồng ý"
                  cancel-text="Không"
                  @confirm="confirmSoftDelete(props.idCard)"
                  placement="right"
              >
                <div class="list-card-edit">
                  <DeleteOutlined/>
                  Xóa thẻ này
                </div>
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
                      v-model:value="province"
                      :options="provinceData.map(pro => ({ value: pro }))"
                  ></a-select>
                  <a-divider orientation="left">
                    <a-typography-text type="secondary">Chọn danh sách</a-typography-text>
                  </a-divider>
                  <a-select
                      ref="select"
                      style="width : 200px"
                      v-model:value="secondCity"
                      :options="cities.map(city => ({ value: city }))"
                  ></a-select>
                  <br/>
                  <a-button type="primary" style="margin-top: 20px">Đồng ý</a-button>
                </template>
                <div class="list-card-edit">
                  <ArrowRightOutlined/>
                  Di chuyển
                </div>
              </a-popover>
            </div>
          </template>
          <button class="button-card-edit">
            <EllipsisOutlined></EllipsisOutlined>
          </button>
        </a-popover>
      </div>
    <a-badge-ribbon
      text="Hoàn thành" color="green"
      v-if="stateOfDueDateInThisCard.whenDueDateOfThisCardIsDone"
      style="position: absolute; top: -34px; right: -18px"/>
    <a-modal
        v-model:open="modalVisible"
        width="1200px"
        footer=""
        style="top: 20px"
        :body-style="{overflowY: 'auto', height: '576px'}"
        :destroy-on-close="true"
    >
      <template #title>
        <a-typography-title :level="3">
          <slot name="cardTitle">{ Card Title }</slot>
        </a-typography-title>
      </template>
      <div class="modal-content-body">
        <a-row>
          <a-col :span="18">
            <a-row :gutter="[8,24]">
              <!--            Dòng này hiện members có trong Card và Description
                              Note: ant-design-vue sử dụng 24 cột 1 dòng, cứ đủ 24 cột sẽ là 1 dòng.
              -->
              <a-col :span="12">
                <AddMembers></AddMembers>
              </a-col>
              <!--            -----------------------Khung Description----------------------------->
              <a-col :span="12">
                <a-flex>
                  <i class="fa-solid fa-bars-staggered icon-title-scaffold"/>
                  <a-tooltip placement="bottom" color="purple">
                    <template #title>
                      <span>Mô tả tổng quan về thẻ này</span>
                    </template>
                    <a-typography-title :level="5">Mô tả</a-typography-title>
                  </a-tooltip>
                </a-flex>
                <a-textarea
                    v-model:value="descriptionText"
                    placeholder="Hộp mô tả sẽ tự động giãn xuống !!!"
                    :auto-size="true"
                    allow-clear
                    @blur="updateDescription"
                />
              </a-col>
              <!--            -----------Khung Labels------------->
              <a-col :span="12" v-if="isAddButton.isLabel">
                <Labels :id-card="props.idCard"></Labels>
              </a-col>
              <!--            Due Date và Description sẽ chung 1 dòng-->
              <a-col :span="12" v-if="isAddButton.isDueDate">
                <DueDate :id-card="props.idCard"></DueDate>
              </a-col>
              <!--            ----------------------Khung Attachment--------------------------------->
              <a-col :span="24" v-if="isAddButton.isAttachment">
                <Upload :id-card="props.idCard" :title-card="titleCard"></Upload>
              </a-col>
              <!--            -----------------------------CheckList-------------------------------
                              Trong 1 card sẽ có nhiều checklist và trong 1 checklist sẽ có nhiều task
                              có thể xóa task và check list, mỗi checklist sẽ có 2 nút 1 nút add task và
                              1 nút delete checklist, mỗi hộp task sẽ có nút xóa hộp task đó.
              -->
              <a-col :span="24" v-if="isAddButton.isCheckList">
                <CheckList :id-card="props.idCard"></CheckList>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :span="3">
<!--            ------------------------Dãy nút thêm các tiện ích vào card------------------------------->
            <a-flex gap="middle" vertical align="center">
              <a-typography-title :level="4" style="margin:0;">Thêm vào thẻ</a-typography-title>
              <a-popover placement="leftTop" trigger="click" color="#e8ffee">
                <template #title>
                  <span>Nhập tên tài khoản hoặc sđt để tìm thành viên mới</span>
                </template>
                <template #content>
<!--                  Event @search trong input này là hàm sử dụng để gọi đến cơ sở dữ liệu
                      sự kiện sẽ được bật khi nhấn enter hoặc nút search
-->
                  <a-input-search
                      v-model:value="searchPersons"
                      placeholder="Nhập tên tài khoản hoặc sđt !!!"
                      @search="onSearch"
                      allow-clear
                      show-count
                  />
                  <a-table
                      style="margin-top: 10px"
                      :dataSource="dataSource"
                      :columns="columns"
                      :pagination="{ defaultPageSize: 5, showSizeChanger: false }"

                  />
                </template>
                <a-button
                    type="text"
                    class="button-on-right-column"
                    block
                >
                  <template #icon>
                    <UserOutlined/>
                  </template>
                  Thành viên
                </a-button>
              </a-popover>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
                  @click="() => {isAddButton.isLabel = !isAddButton.isLabel}"
              >
                <template #icon>
                  <TagOutlined />
                </template>
                Nhãn dán
              </a-button>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
                  @click="() => {isAddButton.isDueDate = !isAddButton.isDueDate}"
              >
                <template #icon>
                  <ClockCircleOutlined />
                </template>
                Đáo hạn
              </a-button>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
                  @click="() => {isAddButton.isAttachment = !isAddButton.isAttachment}"
              >
                <template #icon>
                  <PaperClipOutlined/>
                </template>
                Tệp đính kèm
              </a-button>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
                  @click="() => {isAddButton.isCheckList = !isAddButton.isCheckList}"
              >
                <template #icon>
                  <ScheduleOutlined />
                </template>
                Tạo nhiệm vụ
              </a-button>

<!--              -----------------------Dãy nút hành động---------------------------->
            </a-flex>
            <a-flex gap="middle" vertical align="center" style="margin-top: 50px">
              <a-typography-title :level="4">Hành Động</a-typography-title>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
              >
                <template #icon>
                  <ArrowRightOutlined />
                </template>
                Di chuyển
              </a-button>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
              >
                <template #icon>
                  <CopyOutlined />
                </template>
                Tạo bản sao
              </a-button>
              <a-button
                  type="text"
                  class="button-on-right-column"
                  block
              >
                <template #icon>
                  <ShareAltOutlined />
                </template>
                Share
              </a-button>
            </a-flex>
          </a-col>
          <a-col :span=1></a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.scaffold-of-card{
  --duedate-outline-card: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline: var(--duedate-outline-card) solid  2px;
}
.mini-labels-of-card{
  --color-mini-labels: '';
  background-color: var(--color-mini-labels);
  height: 12px;
  width: 45px;
  border-radius: 8px;
}
.card-in-list{
  height: 100%;
  width: 100%;
}
.list-card-edit{
  margin-bottom: 10px;
  padding: 10px;
}
.list-card-edit:hover{
  cursor: pointer;
  background-color: #cecece;
  border-radius: 8px;
}
.list-card-edit:last-child{
  margin-bottom: 0;
}
.icon-title-scaffold{
  font-size: 20px;
  margin-right: 10px;
}
.button-on-right-column{
  background-color: gainsboro;
  height: 36px;
}
.button-card-edit{
  height: 28px;
  font-size: 16px;
  border: none;
  background-color: transparent;
}
.button-card-edit:hover{
  background-color: #cecece;
  border-radius: 8px;
  cursor: pointer;
}
.button-card-edit:active{
  background-color: #afafaf;
}
.button-card-edit:focus{
  border-radius: 8px;
  background-color: #afafaf;
}
</style>