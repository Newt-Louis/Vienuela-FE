<script setup>
import {ref,watch} from 'vue';
import {
  SettingOutlined,
  PlusOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import CreateBoard from "../pages/workspaces/CreateBoard.vue";
import {useUserStore} from "../store/userstorelog.js";


const userStores = useUserStore();
// biến điều khiển popover
const isVisible = ref(false);
// biến chứa danh sách màu từ database gửi về
const chooseBGColorCreateBoard = ref();
// thuộc tính của header :
// (props là để khi gọi component này ở component khác thì sẽ có thuộc tính để truyền dữ liệu vào)
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'linear-gradient(white,white)',
  },
  textColor: {
    type: String,
    default: '#5b5b5b',
  },
});

/*---------------------------Các Function----------------------------*/
// Phương thức tắt mở popover thông qua nút tạo trong component con
/*const popoverOnOff = () => {
  isVisible.value = !isVisible.value
}*/
/* | những phương thức chưa xác định | đầu*/
const mockVal = (str, repeat = 1) => {
  return {
    value: str.repeat(repeat),
  };
};
const value = ref('');
const options = ref([]);
const onSearch = searchText => {
  console.log('searchText');
  options.value = !searchText
      ? []
      : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
};
const onSelect = value => {
  console.log('onSelect', value);
};
watch(value, () => {
  console.log('value', value.value);
});
/* | bọc lại bởi 2 comment đầu cuối | cuối*/

// Phương thức mở nút create board (+) ở header thì lấy các mã màu ở database về
const openCreateBoard = () => {
  axios.get('http://127.0.0.1:8000/api/opencreateboard')
      .then((response) => {
        chooseBGColorCreateBoard.value = response.data
      })
      .catch((error) => {
        console.log(error);
      })
}
const openSetting = ref(false);
const  showSettingDrawer = () => {
  openSetting.value = true;
}
const closeSettingDrawer = () => {
  openSetting.value = false;
}
const afterOpenChange = bool => {
  console.log('open', bool);
};
const openUser = ref(false);
const showUserDrawer = () => {
  openUser.value = true;
}
const onCloseUser = () => {
  openUser.value = false;
}
const openNotify = ref(false);
const showNotifyDrawer = () => {
  openNotify.value = true;
}
const onCloseNotifyDrawer = () => {
  openNotify.value = false;
}
const test = async (user) => {

  try {
    await userStores.getUserLogout(user);
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="defaultHeader" :style="{backgroundImage: backgroundColor}">
    <a-row>
      <a-col :span="16">
        <a-row style="height: 68px" align="middle" justify="left">
          <a-col :span="5">
            <router-link :to="{ name: 'default_homepage' }" class="brand" :style="{'--text-color': textColor}">
              <img src="/clonetrello.png" alt="" width="40px" height="40px">
              <span> VieNueLa</span>
            </router-link>
          </a-col>
          <a-col :span="4">
            <a-dropdown placement="bottom" arrow>
              <a-button class="btnMenuLeft" :style="{'--text-color': textColor}">
                Không gian làm việc
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <a>1st menu item</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a>2nd menu item</a>
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
          <a-col :span="4">
            <a-dropdown placement="bottom" arrow>
              <a-button class="btnMenuLeft" :style="{'--text-color': textColor}">
                Truy cập gần đây
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <a>1st menu item</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a>2nd menu item</a>
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
          <a-col :span="4">
            <a-dropdown placement="bottom" arrow>
              <a-button class="btnMenuLeft" :style="{'--text-color': textColor}">
                Bảng đánh dấu
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <a>1st menu item</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a>2nd menu item</a>
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
<!--          <a-col :span="2">
            <a-dropdown placement="bottom" arrow>
              <a-button class="btnMenuLeft" :style="{'&#45;&#45;text-color': textColor}">
                Templates
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="0">
                    <a>1st menu item</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a>2nd menu item</a>
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>-->
          <a-col :span="4">
            <a-popover placement="rightTop" trigger="click" v-model:open="isVisible">
              <template #content>
                <CreateBoard :data-background-color="chooseBGColorCreateBoard" v-model="isVisible"></CreateBoard>
              </template>
              <template #title>
                <span>Tạo bảng mới</span>
              </template>
              <a-button type="primary" @click="openCreateBoard">
                <template #icon>
                <PlusOutlined/>
              </template></a-button>
            </a-popover>
          </a-col>
        </a-row>
      </a-col>

<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!---------------------------------Thẻ Input bên phải----------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->

      <a-col :span="8">
          <a-row justify="end" style="align-content: center; height: 68px">
            <a-col :span="12">
              <a-flex>
                <input
                  type="text"
                  placeholder="Tìm bảng làm việc"
                  class="inputsearchtext"
                  :style="{'--text-color': textColor}"
              >
                <a-button class="btn-search" :style="{'--text-color': textColor}">
                  <template #icon>
                    <SearchOutlined></SearchOutlined>
                  </template>
                </a-button>
              </a-flex>
            </a-col>
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!---------------------------------Nút Notify bên phải---------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
            <a-col :span="3">
              <a-button class="aboutUserConfig" :style="{'--text-color': textColor}" @click="showNotifyDrawer">
                  <BellOutlined />
              </a-button>
              <a-drawer
                  title="Tùy chỉnh thông báo"
                  :open="openNotify"
                  placement="right"
                  width="480"
                  @close="onCloseNotifyDrawer"
                  :closable="false"
              >
                <template #extra>
                  <a-button style="margin-right: 8px" @click="onCloseNotifyDrawer">Cancel</a-button>
                  <a-button type="primary">Submit</a-button>
                </template>
              </a-drawer>
            </a-col>
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!---------------------------------Nút User bên phải------------------------------------------------>
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
            <a-col  :span="3">
              <a-button class="aboutUserConfig" :style="{'--text-color': textColor}" @click="showUserDrawer">
                  <UserOutlined />
              </a-button>
              <a-drawer
                  width="480"
                  placement="right"
                  :closable="false"
                  :open="openUser"
                  @close="onCloseUser"
              >
                <template #title>
                <a-typography-title :level="3">{{userStores.userStore.name_user}}</a-typography-title>
                </template>
                <template #extra>
                  <a-button @click="test(userStores.userStore)" type="primary" danger>Đăng xuất</a-button>
                </template>
              </a-drawer>
            </a-col>
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!---------------------------------Nút Setting bên phải--------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
<!-------------------------------------------------------------------------------------------------->
            <a-col :span="3">
                <a-button class="aboutUserConfig" :style="{'--text-color': textColor}" @click="showSettingDrawer">
                  <SettingOutlined/>
                </a-button>
              <a-drawer
                  :open="openSetting"
                  class="custom-class"
                  title="Cấu hình tùy chỉnh"
                  placement="right"
                  @close="closeSettingDrawer"
                  @after-open-change="afterOpenChange"
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </a-drawer>
            </a-col>
          </a-row>

      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
:root{
  --text-color: #2a2a2a;
}
::placeholder {
  color: var(--text-color);
  opacity: 1; /* Firefox */
}
::-ms-input-placeholder {
  color: var(--text-color);
}
.defaultHeader{
  position: fixed;
  z-index: 2;
  width: 100%;
  padding: 0 15px 0 15px;
  border-bottom: #dedede 0.5px solid;
}
.brand{
  margin-bottom: 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
}
.inputsearchtext{
  color: var(--text-color);
  border: none;
  height: 32px;
  border-radius: 5px;
  width: 100%;
  z-index: 1;
  float: right;
  background-color: transparent;
}
.inputsearchtext:focus{
  outline: var(--text-color) 0.5px solid;
  border: none;
}
.btn-search{
  background-color: transparent;
  border: none;
  z-index: 2;
  color: var(--text-color);
  right: 30px;
  box-shadow: none;
}
.btn-search:hover{
  color: var(--text-color);
}
.aboutUserConfig{
  float: right;
  border: none;
  font-size: 18px;
  box-shadow: none;
  z-index: 0;
  background-color: transparent;
  color: var(--text-color);
}
.aboutUserConfig:hover{
  color: var(--text-color);
}
.btnMenuLeft{
  border: none;
  box-shadow: none;
  padding: 0;
  font-size: 14px;
  font-family: San Serif, sans-serif,monospace;
  color: var(--text-color);
  background-color: transparent;
}
</style>
