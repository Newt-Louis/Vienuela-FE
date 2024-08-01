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
useMenuActive.getSelectedKeysMember(['member_joinrequest']);
</script>

<template>
  <h2>Yêu cầu gia nhập</h2>
  <p>Là toàn bộ yêu cầu gia nhập của người dùng khác gửi đến người dùng sở hữu không gian làm việc của họ.</p>
  <a-divider/>
  <a-row justify="space-between">
    <a-col :span="24">{Hiển thị thông báo có bao nhiêu lời đề nghị. Nếu không thì thông báo là không}</a-col>
    <a-col :span="24">{thẻ input filter by name}</a-col>
  </a-row>
  <a-row justify="space-between">
    <a-col :span="4">{Hộp checkbox đánh dấu tất cả}</a-col>
    <a-col :span="4">Thêm viên chính thức</a-col>
    <a-col :span="4">Thêm thành viên vào bảng</a-col>
    <a-col :span="4">Xóa các yêu cầu đã chọn</a-col>
  </a-row>
  <a-divider/>
  <a-table :dataSource="data" :columns="columns" :pagination="false" :scroll="{x: 478}"/>
</template>

<style scoped>

</style>