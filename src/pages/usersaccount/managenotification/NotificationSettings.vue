<script setup>
import {useMenuActiveKey} from "../../../store/menuactivekeystore/use-menu-active-key.js";

const useMenuActive = useMenuActiveKey();
useMenuActive.getOpenKeys(['sub2']);
useMenuActive.getSelectedKey(['managenotification']);
</script>

<template>
<h1>Đây là trang tùy chọn hiển thị thông báo</h1>
</template>

<style scoped>

</style>