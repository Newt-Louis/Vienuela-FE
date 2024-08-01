<script setup>
import {useMenuActiveKey} from "../../store/menuactivekeystore/use-menu-active-key.js";

const useMenuActive = useMenuActiveKey();
useMenuActive.getOpenKeys(['member']);
useMenuActive.getSelectedKey(['member_workspacemember']);
</script>

<template>
<!--  Trang quản lý members là trang mà tổng kết toàn bộ members mà có khóa ngoại là thuộc id
      của người dùng đang đăng nhập, người dùng đang đăng nhập cũng có thể có khóa ngoại là 1 id
      của workspace khác, hoặc không. Nhưng có khóa ngoại đồng nghĩa là có tham gia vào cùng nhóm
      với id đang đăng nhập, và sẽ chia members chính thức, và members chỉ thuộc 1 board duy nhất
      bằng việc sử dụng 2 cột board-id và workspace-id với xác định giữa cùng có giá trị trong 2 cột
      hoặc 1 có 1 không, hoặc cả 2 đều không có giá trị.
-->
<div><h1>Render Work Space of User </h1></div>
  <a-divider/>
  <a-row>
    <a-col :xl="5" :lg="5" :md="5" :sm="24">
      <h2>Danh sách</h2>
      <a-menu
        mode="inline"
        v-model:selected-keys="useMenuActive.selectedKeysMembers"
      >
        <router-link :to="{name: 'member_workspacemember'}" class="memberlinkstyle">
          <a-menu-item key="member_workspacemember" >
            Thành viên chính thức ()
          </a-menu-item>
        </router-link>
        <router-link :to="{name:'member_guestmember'}" class="memberlinkstyle">
          <a-menu-item key="member_guestmember" >
            Thành viên ()
          </a-menu-item>
        </router-link>
        <router-link :to="{name:'member_joinrequest'}" class="memberlinkstyle">
          <a-menu-item key="member_joinrequest" >
            Yêu cầu gia nhập
          </a-menu-item>
        </router-link>
      </a-menu>
    </a-col>
    <a-col :xl="19" :lg="19" :md="19" :sm="24" style="padding: 40px 10px 20px 20px">
      <router-view></router-view>
    </a-col>
  </a-row>
</template>

<style scoped>
.memberlinkstyle{
  text-decoration: none;
  color: black;
}
</style>