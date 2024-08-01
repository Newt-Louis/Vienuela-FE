<script setup>
import {useUserStore} from "../store/userstorelog.js";
import {computed, onBeforeMount, onMounted, reactive, ref, watch, watchEffect} from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  UserAddOutlined
} from "@ant-design/icons-vue";
import {useWorkSpaceStore} from "../store/crudworkspace.js";
import {useMenuActiveKey} from "../store/menuactivekeystore/use-menu-active-key.js";
import {useBoardStore} from "../store/crudboard.js";
import axios from "axios";

const userStores = useUserStore();
const workspaceStores = useWorkSpaceStore();
const boardsStores = useBoardStore();
const useMenuActive = useMenuActiveKey();
workspaceStores.fetchWorkSpaceOwned();
useMenuActive.getOpenKeys(['sub1']);
useMenuActive.getSelectedKey(['workspace_by_user']);
const filterOption = (input, option) => {
  return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};
const value = ref('');
const options = ref([
  {
    value: 'Burns Bay Road',
  },
  {
    value: 'Downing Street',
  },
  {
    value: 'Wall Street',
  },
]);
const workspaceState = reactive({
  openPopoverNewWorkSpace: false,
  openPopoverUpdateWorkSpace: false,
  inputTitle: '',
  inputTitleUpdate: '',
  inputWorkSpaceTitleStatus: computed(() => workspaceStores.workspaceState.workspaceInputStatus),
  dataErrorWorkSpaceStatus: computed(() => workspaceStores.workspaceState.workspaceErrorData),
  inputWorkSpaceTitleUpdateStatus: computed(() => workspaceStores.workspaceState.workspaceInputStatusUpdate),
  dataErrorWorkSpaceTitleUpdateStatus: computed(() => workspaceStores.workspaceState.workspaceErrorDataUpdate),
})
const addNewWorkSpace = async (inputTitle) => {
  let dataToAdd = {
    workspaceTitle: inputTitle,
    idUser: userStores.userStore.id_user,
  }
  await workspaceStores.addNewWorkSpace(dataToAdd);
}
const updateTitleWorkspace = async (inputTitle,idWorkSpace) => {
  let dataToUpdate = {
    workspaceTitle: inputTitle,
    workspaceID: idWorkSpace,
    idUser: userStores.userStore.id_user,
  }
  try {
    await workspaceStores.updateWorkSpace(dataToUpdate);
    workspaceState.inputTitleUpdate = '';
    workspaceState.openPopoverUpdateWorkSpace = false;
  } catch (error){
    workspaceState.openPopoverUpdateWorkSpace = true;
  }
}
const softDeleteWorkspace = (value) => {
  let dataToDelete = {
    idWorkSpace: value,
    idUser: userStores.userStore.id_user,
  }
  workspaceStores.deleteWorkSpace(dataToDelete);
}
watchEffect(async () => {
    for (let i = 0; i < workspaceStores.workspaceStoreOwned.length; i++) {
      await boardsStores.getBoardOwned(workspaceStores.workspaceStoreOwned[i].workspaceId);
    }
})
</script>

<template>
  <div>
    <a-divider><a-typography-title :level="4">Không gian làm việc của bạn</a-typography-title></a-divider>
    <a-row :gutter="[0,24]">
      <a-col :span="12" v-for="(i,index) in workspaceStores.workspaceStoreOwned" :key="index">
        <a-flex align="center" gap="large">
          <a-flex align="center" gap="middle">
            <router-link :to="{name: 'boardviewbyworkspace', params: {idWorkSpace: i.workspaceId}}">
              <div class="workspace-view">
                <a-typography-text
                    strong
                    class="workspace-title"
                >
                  {{ i.workspaceTitle }}
                </a-typography-text>
              </div>
            </router-link>
            <a-typography-text>
              {{ "Số lượng thành viên: 24" }}
            </a-typography-text>
          </a-flex>
          <a-popover placement="rightTop" trigger="click">
            <template #content>
              <div class="layout-workspace-edit">
                <a-popover trigger="click" placement="rightTop" v-model:open="workspaceState.openPopoverUpdateWorkSpace">
                  <template #title>Đổi tên</template>
                  <template #content>
                    <a-flex vertical gap="small">
                      <a-input
                          v-model:value="workspaceState.inputTitleUpdate"
                          placeholder="Nhập tiêu đề...."
                          :maxlength="25"
                          :status="workspaceState.inputWorkSpaceTitleUpdateStatus"
                          allow-clear
                          show-count
                          @pressEnter="updateTitleWorkspace(workspaceState.inputTitleUpdate,i.workspaceId)"
                      ></a-input>
                      <a-typography-text
                        v-if="workspaceState.dataErrorWorkSpaceTitleUpdateStatus.workspaceTitle"
                        type="danger"
                      >
                        {{ workspaceState.dataErrorWorkSpaceTitleUpdateStatus.workspaceTitle[0] }}
                      </a-typography-text>
                      <a-button
                        type="primary"
                        @click="updateTitleWorkspace(workspaceState.inputTitleUpdate,i.workspaceId)">Đồng ý
                      </a-button>
                    </a-flex>
                  </template>
                  <div class="workspace-list-edit"><EditOutlined /> Sửa tiêu đề</div>
                </a-popover>
                <a-popconfirm
                  title="Bạn có chắc muốn xóa danh sách này?"
                  ok-text="Đồng ý"
                  cancel-text="Không xóa"
                  @confirm="softDeleteWorkspace(i.workspaceId)"
                  placement="right"
                >
                  <div class="workspace-list-edit"><DeleteOutlined/> Xóa</div>
                </a-popconfirm>
                <a-popover placement="rightTop" trigger="click">
                  <template #title>Nhập email hoặc số điện thoại hoặc tên tài khoản</template>
                  <template #content>
                    <a-auto-complete
                        v-model:value="value"
                        :options="options"
                        style="width: 100%"
                        placeholder="input here"
                        :filter-option="filterOption"
                    />
                  </template>
                  <div class="workspace-list-edit"><UserAddOutlined/> Thêm thành viên</div>
                </a-popover>
              </div>
            </template>
            <a-button type="text">
              <template #icon>
                <EllipsisOutlined/>
              </template>
            </a-button>
          </a-popover>
        </a-flex>
      </a-col>
      <a-col :span="12">
        <a-flex justify="center" style="height: 80px" align="center">
          <a-popover>
            <template #title>Nhập tiêu đề cho không gian mới</template>
            <template #content>
              <a-flex vertical gap="small">
                <a-input
                  v-model:value="workspaceState.inputTitle"
                  :status="workspaceState.inputWorkSpaceTitleStatus"
                  allow-clear
                  show-count
                  :maxlength="25"
                  @pressEnter="addNewWorkSpace(workspaceState.inputTitle)"
                ></a-input>
                <a-typography-text v-if="workspaceState.dataErrorWorkSpaceStatus.workspaceTitle" type="danger">{{workspaceState.dataErrorWorkSpaceStatus.workspaceTitle[0]}}</a-typography-text>
                <a-button type="primary" @click="addNewWorkSpace(workspaceState.inputTitle)">Đồng ý</a-button>
              </a-flex>
            </template>
            <a-button class="button-new-workspace" type="text">Thêm mới</a-button>
          </a-popover>
        </a-flex>
      </a-col>
    </a-row>
  </div>
  <a-divider><a-typography-title :level="4">Không gian làm việc đang tham gia</a-typography-title></a-divider>
  <a-empty />
</template>

<style scoped>
.workspace-view{
  width: 200px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00ab00 !important;
}
.workspace-title{
  color: white;
  font-size: 12px;
  word-break: break-word;
}
.workspace-view:hover{
  cursor: pointer;
  background-color: white;
  opacity: 0.5;
}
.workspace-view:active{
  background-color: black;
  opacity: 0.8;
}
.workspace-list-edit{
  margin-bottom: 10px;
  padding: 10px
}

.workspace-list-edit:hover{
  cursor: pointer;
  background-color: #cecece;
  border-radius: 8px;
}
.workspace-list-edit:last-child{
  margin-bottom: 0;
}
.button-new-workspace{
  width: 50%;
}
</style>