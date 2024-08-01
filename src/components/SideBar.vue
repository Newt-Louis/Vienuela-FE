<script setup>
import {reactive, watch, h, ref} from 'vue';
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  DatabaseOutlined,
  BookOutlined,
  UnorderedListOutlined,
  ProjectOutlined,
  ApartmentOutlined,
  AuditOutlined,
  NotificationOutlined,
} from '@ant-design/icons-vue';
import {useUserStore} from "../store/userstorelog.js";
import {useMenuActiveKey} from "../store/menuactivekeystore/use-menu-active-key.js";
const props = defineProps({
  textSidebarColor: {
    type: String,
    default: 'black',
  }
});
const useMenuActive = useMenuActiveKey();
const userStores = useUserStore();
</script>

<template>
  <a-menu
    mode="inline"
    id="sidebarhompage"
    :style="{'--text-sidebar-color': textSidebarColor}"
    v-model:open-keys="useMenuActive.openKeys"
    v-model:selected-keys="useMenuActive.selectedKeys"
  >
    <a-sub-menu key="sub1">
      <template #icon><DashboardOutlined /></template>
      <template #title>Không gian làm việc</template>
      <router-link
        :to="{name: 'default_homepage'}"
        class="sidebarlinkstyle"
        :style="{'--text-sidebar-color': textSidebarColor}"
      >
        <a-menu-item key="workspace_by_user">
          <template #icon>
            <ProjectOutlined/>
          </template>
          <template #default>Không gian làm việc hiện tại</template>
        </a-menu-item>
      </router-link>
      <router-link
        :to="{name : 'workspaces', params: {idUser: userStores.userStore.id_user}}"
        class="sidebarlinkstyle" :style="{'--text-sidebar-color': textSidebarColor}"
      >
        <a-menu-item key="workspaces">
          <template #icon><ApartmentOutlined /></template>
          <template #default>Các bảng hiện tại</template>
        </a-menu-item>
      </router-link>
      <a-sub-menu key="sub1-1">
        <template #icon>
          <BookOutlined />
        </template>
        <template #title>Nhiệm vụ</template>
        <router-link
          :to="{name: 'highlights_table'}"
          class="sidebarlinkstyle"
          :style="{'--text-sidebar-color': textSidebarColor}"
        >
          <a-menu-item key="highlights_table">
          <template #icon><UnorderedListOutlined /></template>
            <span>Thẻ nhiệm vụ</span>
          </a-menu-item>
        </router-link>
        <router-link :to="{name: 'highlights_calendar'}" class="sidebarlinkstyle" :style="{'--text-sidebar-color': textSidebarColor}">
          <a-menu-item key="highlights_calendar">
           <template #icon><i class="fa-regular fa-calendar-check"></i></template>
            <span>Lịch</span>
          </a-menu-item>
        </router-link>
      </a-sub-menu>
    </a-sub-menu>
      <router-link :to="{path: '/member'}" class="sidebarlinkstyle" :style="{'--text-sidebar-color': textSidebarColor}">
        <a-menu-item key="member">
          <UsergroupAddOutlined/>
          <span>Quản lý thành viên</span>
        </a-menu-item>
      </router-link>
    <a-sub-menu key="sub2">
      <template #icon><DatabaseOutlined /></template>
      <template #title>Quản lý tài khoản</template>
      <router-link :to="{ name: 'useraccount'}" class="sidebarlinkstyle" :style="{'--text-sidebar-color': textSidebarColor}">
        <a-menu-item key="useraccount">
          <template #icon><AuditOutlined /></template>
          <template #default>Thông tin cá nhân</template>
        </a-menu-item>
      </router-link>
      <router-link :to="{ name: 'managenotification'}" class="sidebarlinkstyle" :style="{'--text-sidebar-color': textSidebarColor}">
        <a-menu-item key="managenotification">
          <template #icon><NotificationOutlined /></template>
          <template #default>Quản lý thông báo</template>
        </a-menu-item>
      </router-link>
    </a-sub-menu>
  </a-menu>
</template>


<style scoped>
:root{
  --text-sidebar-color: #000000;
}
#sidebarhompage {
  border: none;
  width: 100%;
  background-color: transparent;
  color: var(--text-sidebar-color);
  transition: none;
}
.sidebarlinkstyle{
  text-decoration: none;
  color: var(--text-sidebar-color);
}
</style>
