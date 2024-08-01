<script setup>
import {ref} from "vue";
import {useMenuActiveKey} from "../../../store/menuactivekeystore/use-menu-active-key.js";

const useMenuActive = useMenuActiveKey();
useMenuActive.getOpenKeys(['sub1','sub1-1']);
useMenuActive.getSelectedKey(['highlights_table']);

const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
</script>

<template>
  <a-typography-title :level="3" type="secondary">Danh sách thẻ hiện tại</a-typography-title>
  <a-flex style="margin-bottom: 10px" gap="middle">
    <a-button type="primary">Loại bỏ các thẻ chưa có thời gian đáo hạn</a-button>
    <a-button type="primary">Loại bỏ các thẻ chưa có thành viên nào tham gia</a-button>
  </a-flex>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: '70vh' }">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'operation'">
        <a>action</a>
      </template>
    </template>
  </a-table>
</template>

<style scoped>

</style>