<script setup>
import {message, notification} from "ant-design-vue";
import {
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined, PaperClipOutlined,
} from "@ant-design/icons-vue";
import {ref} from "vue";
import {useCardFunctionLogic} from "../../../composable/cardFunctionComposableLogic.js";


const props = defineProps({
  idCard: '',
  titleCard: '',
})
const {
  filesStore,
  fetchFilesThisCardHave,
  deleteAttachmentInThisCard,
} = useCardFunctionLogic(props);
const urlFiles = 'http://127.0.0.1:8000/storage/';
fetchFilesThisCardHave();
const checkBeforeUpload = file => {
  const isLimitt100M = file.size / 1024 / 1024 < 100;
  const isAudioOrVideo = file.type.includes('audio') || file.type.includes('video');
  if (!isLimitt100M) {
    notification.error({
      message: 'Có lỗi xảy ra',
      description: 'File phải nhỏ hơn 100MB !!!',
      placement: "topRight",
    })
  return false;
  }
  if  (isAudioOrVideo){
    notification.error({
      message: 'Có lỗi xảy ra',
      description: 'Không chấp nhận file video hoặc âm thanh',
      placement: "topRight",
    })
    return false;
  }
  return true;
}
const handleSuccess = (response,file) => {
  notification.success({
    message: 'Tải tệp đính kèm thành công !!!',
    description: response.data,
    placement: "topRight",
  })
  fetchFilesThisCardHave();
};
const handleError = (error, file) => {
  notification.error({
    message: 'Có lỗi xảy ra với máy chủ !!! Vui lòng thử lại sau',
    description: error.response.data.message,
    placement: 'topRight',
  })
}
const getIconImageForFile = (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension){
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return urlFiles+filePath;
    case 'pdf':
      return '/src/assets/icon-pdf.png' ;
    case 'doc':
    case 'docx':
      return '/src/assets/icon-word.png';
    case 'xls':
    case 'xlsx':
      return '/src/assets/icon-excel.png'
    default:
      return '/src/assets/No-Image-Placeholder.svg.webp'
  }
}
</script>

<template>
<div>
  <a-flex style="margin-bottom: 10px" justify="space-between">
    <a-flex>
      <PaperClipOutlined class="icon-title-scaffold"/>
      <a-typography-title :level="5">Tệp đính kèm</a-typography-title>
    </a-flex>
    <a-upload
        name="file"
        :action="'http://127.0.0.1:8000/api/upload/create_or_update/'+props.idCard"
        :before-upload="checkBeforeUpload"
        @success="handleSuccess"
        @error="handleError"
        :show-upload-list="false"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Bấm vào đây để upload file
      </a-button>
    </a-upload>
  </a-flex>
  <a-row v-if="filesStore.length === 0" align="center">
    <a-empty></a-empty>
  </a-row>
  <a-row
      style="margin-bottom: 10px"
      v-else
      :gutter="12"
      v-for="(item,index) in filesStore"
  >
    <a-col :span="6" class="attachment-image">
      <img class="image-attachment" :src="getIconImageForFile(item.attachmentPath)" alt="Tệp đính kèm">
    </a-col>
    <a-col :span="18" class="attachment-info">
      <a-typography-title :level="5">{{item.attachmentName}}</a-typography-title>
      <small>{{item.createAt}}</small>
      <a-flex :style="{height: '40px'}" justify="space-around" align="center">
        <a :href="urlFiles+item.attachmentPath" download target="_blank">
          <a-button type="text">
            <template #icon>
              <DownloadOutlined/>
            </template>
            Tải tệp
          </a-button>
        </a>
<!--        <a-button type="text">
          <template #icon>
            <EditOutlined/>
          </template>
          Đổi tên
        </a-button>-->
        <a-button type="text" @click="deleteAttachmentInThisCard(item.idCard,item.idAttachment,item.attachmentName)">
          <template #icon>
            <DeleteOutlined/>
          </template>
          Xóa tệp
        </a-button>
      </a-flex>
    </a-col>
  </a-row>
</div>
</template>

<style scoped>
.icon-title-scaffold{
  font-size: 20px;
  margin-right: 10px;
}
.attachment-image{
  height: 100px;
}
.attachment-info{
  height: 100px;
}
.image-attachment{
  max-width: 100%;
  height: 100px;
}
</style>