<script setup>
import {useMenuActiveKey} from "../../../store/menuactivekeystore/use-menu-active-key.js";

const useMenuActive = useMenuActiveKey();
const columns = [
  {
    name: 'Name',
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
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
useMenuActive.getSelectedKeysMember(['member_workspacemember']);
</script>

<template>
<h2>Thành viên chính thức ()</h2>
  <p>Thành viên chính thức có thể xem tất cả bảng của không gian làm việc và tạo các bảng mới.</p>
  <a-divider/>
  <a-row justify="space-between">
    <a-col :span="12"><h2>Thêm thành viên chính thức gửi bằng link</h2></a-col>
    <a-col :span="6"><p style="float: right;">{button invite with a link}</p></a-col>
  </a-row>
  <a-divider/>
  <a-table :dataSource="data" :columns="columns" :pagination="false" :scroll="{ x: 478 }"/>
</template>

<style scoped>

</style>