<script setup>
import {computed, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {notification} from "ant-design-vue";
import {ClockCircleOutlined} from '@ant-design/icons-vue'
import {useDueDatesStore} from "../../../store/cardfunctionstore/dueDateStore.js";
import dayjs from "dayjs";


const useDueDateStore = useDueDatesStore();
const props = defineProps({
  idCard: '',
})
const dateValue = computed(() => useDueDateStore.cardsDueDateStore[props.idCard]);

const options1 = ref(Array.from({length: 7}, (_,i) => ({
  value: `${i + 1}`,
  label: `${i + 1} ngày`,
})));
let newSeletectOption = {
  value: null,
  label: 'Không đặt',
}
options1.value.unshift(newSeletectOption);
const formattedRendering = reactive({
  dateRenderValue: [
    dateValue.value.startDate ? dayjs(dateValue.value.startDate) : null,
    dateValue.value.dueDate ? dayjs(dateValue.value.dueDate) : null,
  ],
  warningValue: options1.value.find(i => i.value === dateValue.value.warningInfo),
  dangerValue: options1.value.find(i => i.value === dateValue.value.dangerInfo),
  checkDueDateIsDone: dateValue.value ? dateValue.value.isDueDateDone : false,
})
const statusRangePicker = ref();
let interVal;
let warnShown = ref(true);
const getStatusRangePicker = () => {
  let expiredDay = dayjs(dateValue.value.dueDate);
  let now = dayjs();
  let daysLeft = expiredDay.diff(now, 'day');
  let warning = formattedRendering.warningValue ? formattedRendering.warningValue.value : null;
  let danger = formattedRendering.dangerValue ? formattedRendering.dangerValue.value : null;
  if (warning === null && danger === null){
    statusRangePicker.value = '';
  } else if (warning === null){
    if (daysLeft <= danger){
      statusRangePicker.value = 'error';
    }
  } else if (danger === null){
    if (daysLeft <= warning){
      statusRangePicker.value = 'warning'
    }
  } else if (warning <= danger && warnShown.value){
    notification.warn({
      message: 'Giá trị cảnh báo không khớp !!!',
      description: 'Ngày cận hạn nhỏ hơn ngày đến hạn, vì vậy ngày cận hạn được xem như bỏ qua và chỉ tính thời gian của ngày đến hạn.',
      placement: "topRight",
    })
    warnShown.value = false;
    if (daysLeft <= danger){
      statusRangePicker.value = 'error';
    }
  } else {
    if (daysLeft <= danger){
      statusRangePicker.value = 'error';
    } else if (daysLeft <= warning) {
      statusRangePicker.value = 'warning';
    } else {
      statusRangePicker.value = '';
    }
  }
}
const onRangeChange = async (value, dateString) => {
  let dataDueDateToAdd = {
    idCard: props.idCard,
    startDate: dateString[0],
    dueDate: dateString[1],
  };
  await useDueDateStore.createOrUpdateDueDateThisCard(dataDueDateToAdd);
};

const changeValueOnSelectWarning = async (value) => {
  let dataDueDateWarningInfo = {
    idCard: props.idCard,
    warningInfo: value,
  }
  try {
  await useDueDateStore.createOrUpdateWarning(dataDueDateWarningInfo);
  } catch (e) {
    formattedRendering.warningValue = null;
  }
};
const changeValueOnSelectDanger = async (value) => {
  let dataDueDateDangerInfo = {
    idCard: props.idCard,
    dangerInfo: value,
  }
  try {
    await useDueDateStore.createOrUpdateDanger(dataDueDateDangerInfo);
  } catch (e) {
    formattedRendering.dangerValue = null;
  }
};
const isDueDateDone = async (isChecked) => {
  let dataToCheck = {
    idCard: props.idCard,
    isDueDateDone: isChecked,
  }
  await useDueDateStore.checkDoneDueDateForThisCard(dataToCheck);
}
onMounted(() => {
  console.log(dateValue.value)
  interVal = setInterval(getStatusRangePicker,1000);
})
onUnmounted(() => {
  clearInterval(interVal);
})
</script>

<template>
  <a-row :gutter="[0,12]">
    <a-col :span="24">
      <a-badge-ribbon text="Hoàn thành" color="green" v-if="formattedRendering.checkDueDateIsDone"/>
      <a-flex>
        <ClockCircleOutlined class="icon-title-scaffold"/>
        <a-typography-title :level="5">Ngày đáo hạn</a-typography-title>
      </a-flex>
    </a-col>
    <a-col :span="24">
      <div>
        <a-checkbox
            @change="isDueDateDone(formattedRendering.checkDueDateIsDone)"
            v-model:checked="formattedRendering.checkDueDateIsDone"
            style="margin-bottom: 10px">
          Đánh dấu thẻ đã hoàn thành
        </a-checkbox>
      </div>
      <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="DD-MM-YYYY HH:mm"
          :placeholder="['Thời gian bắt đầu', 'Thời gian kết thúc']"
          v-model:value="formattedRendering.dateRenderValue"
          placement="topRight"
          @change="onRangeChange"
          :disabled="formattedRendering.checkDueDateIsDone"
          :status="statusRangePicker"
      >
        <template #renderExtraFooter>
          <a-typography-paragraph style="padding-left: 10px; margin-bottom: 0">
            - Ngày bắt đầu và kết thúc phải luôn được chọn.<br/>
            - Khi cập nhật ngày kết thúc khác sẽ tự động được chuyển hướng đến
            ngày bắt đầu để chọn ngày bắt đầu khác, nếu không thay đổi ngày bắt đầu khác
            thì tiếp tục click ok hoặc click ra chỗ khác để hệ thống tự động lưu.
          </a-typography-paragraph>
        </template>
      </a-range-picker>
    </a-col>
    <a-col :span="12">
      <a-typography-text type="warning">Thiết lập cảnh báo cận hạn khi còn:</a-typography-text>
      <a-select
          ref="select"
          v-model:value="formattedRendering.warningValue"
          style="width: 120px; margin-left: 10px"
          :options="options1"
          status="warning"
          :disabled="formattedRendering.checkDueDateIsDone"
          placeholder="Tùy chọn"
          @change="changeValueOnSelectWarning"
      >
      </a-select>
    </a-col>
    <a-col :span="12">
      <a-typography-text type="danger">Thiết lập cảnh báo đến hạn khi còn:</a-typography-text>
      <a-select
          ref="select"
          v-model:value="formattedRendering.dangerValue"
          style="width: 120px; margin-left: 10px"
          :options="options1"
          status="error"
          :disabled="formattedRendering.checkDueDateIsDone"
          placeholder="Tùy chọn"
          @change="changeValueOnSelectDanger"
      ></a-select>
    </a-col>
  </a-row>
</template>

<style scoped>
.icon-title-scaffold{
  font-size: 20px;
  margin-right: 10px;
}
</style>