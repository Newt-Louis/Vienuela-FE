<script setup>
import {useMenuActiveKey} from "../../../store/menuactivekeystore/use-menu-active-key.js";

const useMenuActive = useMenuActiveKey();
useMenuActive.getOpenKeys(['sub2']);
useMenuActive.getSelectedKey(['useraccount']);
</script>

<template>
<h1>Đây là trang cấu hình thông tin cá nhân</h1>
</template>

<style scoped>

</style>