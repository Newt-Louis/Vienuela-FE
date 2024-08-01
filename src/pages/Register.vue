<script setup>
import {
  InboxOutlined,
  LockOutlined,
  ProfileOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import {reactive,ref} from "vue";
import {notification} from "ant-design-vue";
import {useUserStore} from "../store/userstorelog.js";


const userStores = useUserStore();
const errorWhenUniqueUserAndEmail = ref({});
// template ref của Vue sử dụng để lấy phương thức có sẵn của a-form l validateFields()
const formRef = ref();
/*----------------------- 2 Phương thức xử lý của trường password và passwordconfirm--------------------------*/
const validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Chưa nhập mật khẩu !');
  } else{
    if (formState.passwordconfirm !== '') {
      formRef.value.validateFields('passwordconfirm');
    }
    return Promise.resolve();
  }
}
const validatePassConfirm = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Chưa nhập mật khẩu xác nhận !');
  } else if (value !== formState.password) {
    return Promise.reject('Mật khẩu xác nhận không khớp !');
  } else {
    return Promise.resolve();
  }
}
/*-------------Biến đặt xác thực cho các trường input mỗi một thuộc tính của đối tượng tương ứng với
* -------------name của thẻ <a-form-item>--------------------*/
const rules = {
  realname: [
    {
      required: true,
      message: 'Chưa nhập họ và tên !',
      trigger: 'change'
    }
  ],
  phone: [
    {
      required: true,
      message: 'Chưa nhập số điện thoại !',
      trigger: 'change',
    },
    {
      pattern: /^\d+$/,
      message: 'Chỉ được phép nhập ký tự là số !',
      trigger: 'change',
    },
    {
      pattern: /^\d{10}$/,
      message: 'Số điện thoại phải có 10 chữ số !',
      trigger: 'change',
    }
  ],
  email: [
    {
      required: true,
      message: 'Chưa nhập email !',
      trigger: 'change',
    },
    {
      type: 'email',
      message: 'Email không hợp lệ !',
      trigger: 'change',
    }
  ],
  username: [
    {
      required: true,
      message: 'Chưa nhập tên tài khoản',
      trigger: 'change',
    },
    {
      max: 25,
      message: 'Tên tài khoản tối đa 25 ký tự',
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    }
  ],
  passwordconfirm: [
    {
      required: true,
      validator: validatePassConfirm,
      trigger: 'change',
    }
  ],
}
/*-----------------Biến kết nối với v-model của form xử lý dữ liệu cho các trường input-----------------------*/
const formState = reactive({
  realname: '',
  phone: '',
  email: '',
  username: '',
  password:'',
  passwordconfirm:'',
  dragger: [],
  remember: false,
});

// Biến được sử dụng để v-bind làm gọn phần template với 4 thuộc tính
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
  rules: rules,
  model: formState,
};
/*---------------------Đoạn xử lý form với ẩn hiện nút đăng ký---------------------------------*/
const onFinish = async values => {
  let dataToSendRequestRegis = {
    realname: values.realname,
    phone: values.phone,
    email: values.email,
    username: values.username,
    password: values.password,
    passwordconfirm: values.passwordconfirm,
    dragger: values.dragger,
    remember: values.remember,
  }
  try {
    await userStores.registerUser(dataToSendRequestRegis);
  } catch (e) {
    console.log(e);
    errorWhenUniqueUserAndEmail.value = e.response.data.errors;
  }
};
const disabled = ref(true);
const fieldStatus = reactive({
  realnameValid: false,
  phoneValid: false,
  emailValid: false,
  usernameValid: false,
  passwordValid: false,
  passwordconfirmValid: false,
})
const validateFormRegis = (...argument) => {
  let [field,isValid] = argument;
  if (field === 'realname') {
    fieldStatus.realnameValid = isValid;
  } else if (field === 'phone') {
    fieldStatus.phoneValid = isValid;
  } else if (field === 'email') {
    fieldStatus.emailValid = isValid;
  } else if (field === 'username') {
    fieldStatus.usernameValid = isValid;
  } else if (field === 'password') {
    fieldStatus.passwordValid = isValid;
  } else if (field === 'passwordconfirm') {
    fieldStatus.passwordconfirmValid = isValid;
  }
  disabled.value = !Object.values(fieldStatus).every(status => status);
}

/*-------Đoạn xử lý thẻ upload, ngăn việc tự động upload tới server và kiểm tra trước khi upload--------*/
const changingUpload = (item) => {
  const isLimitt100M = item.file.size / 1024 / 1024 < 100;
  const isAudioOrVideo = item.file.type.includes('audio') || item.file.type.includes('video');
  const isImageFile = item.file.type.startsWith('image/');
  const isSupportExtension = /\.(jpeg|jpg|png|webp)$/i.test(item.file.name);
  console.log(item)
  if (!isLimitt100M) {
    notification.error({
      message: 'Có lỗi xảy ra',
      description: 'File phải nhỏ hơn 100MB !!!',
      placement: "topRight",
    })
    formState.dragger = [];
    return false;
  }
  if  (isAudioOrVideo){
    notification.error({
      message: 'Có lỗi xảy ra',
      description: 'Không chấp nhận file video hoặc âm thanh',
      placement: "topRight",
    })
    formState.dragger = [];
    return false;
  }
  if (!isImageFile) {
    notification.error({
      message: 'Chỉ chấp nhận file là hình ảnh',
      placement: 'topRight',
    });
    formState.dragger = [];
    return false;
  }
  if (!isSupportExtension){
    notification.error({
      message: 'Chỉ chấp nhận hình .jpg, .jpeg, .png, .webp',
      placement: "topRight"
    })
    formState.dragger = [];
    return false;
  }
  if (formState.dragger.length > 1){
    notification.error({
      message: 'Chỉ chấp nhận 1 Avatar',
      description: 'Xóa Avatar đã upload trước đó hoặc vui lòng thử lại !',
      placement: "topRight",
    })
    formState.dragger.pop();
    return false;
  }
  return false;
}
const checkBeforeUpload = async (item) => {
  const isLimitt100M = item.size / 1024 / 1024 < 100;
  const isAudioOrVideo = item.type.includes('audio') || item.type.includes('video');
  const isImageFile = item.type.startsWith('image/');
  const isSupportExtension = /\.(jpeg|jpg|png|webp)$/i.test(item.name);
  if (!isLimitt100M) {
    formState.dragger = [];
    return false;
  }
  if  (isAudioOrVideo){
    formState.dragger = [];
    return false;
  }
  if (!isImageFile) {
    formState.dragger = [];
    return false;
  }
  if (!isSupportExtension){
    formState.dragger = [];
    return false;
  }
  if (formState.dragger.length > 1){
    formState.dragger.pop();
    return false;
  }
  return false;
}
</script>

<template>
  <a-modal :open="true" centered :closable="false" :footer="null" :width="720">
    <template #title>
      <a-flex vertical align="center">
        <a-typography-title style="margin: 0; padding: 15px 0 0 0; font-weight: bold">
          <img style="border-radius: 8px" src="/clonetrello.png" alt="" width="60px" height="60px"> Vienuela
        </a-typography-title>
        <a-typography-title style="margin: 20px 0 10px 0" :level="3" type="secondary">Đăng ký</a-typography-title>
      </a-flex>
    </template>
  <a-form
      ref="formRef"
      name="register_user_validate"
      v-bind="formItemLayout"
      @finish="onFinish"
      @validate="validateFormRegis"
  >
    <a-form-item label="Họ và Tên" name="realname" has-feedback>
      <a-input id="realname" placeholder="Nhập họ và tên" v-model:value="formState.realname" allow-clear>
        <template #prefix>
          <ProfileOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item label="Số điện thoại" name="phone" has-feedback>
      <a-input id="phone" v-model:value="formState.phone" placeholder="Nhập số điện thoại" allow-clear>
        <template #prefix>
          <PhoneOutlined />
        </template>
      </a-input>
      <a-typography-text v-if="errorWhenUniqueUserAndEmail.phone" type="danger">{{errorWhenUniqueUserAndEmail.phone[0]}}</a-typography-text>
    </a-form-item>
    <a-form-item label="Email" name="email" has-feedback>
      <a-input id="email" v-model:value="formState.email" placeholder="Nhập Email" allow-clear>
        <template #prefix>
          <MailOutlined />
        </template>
      </a-input>
      <a-typography-text v-if="errorWhenUniqueUserAndEmail.email" type="danger">{{errorWhenUniqueUserAndEmail.email[0]}}</a-typography-text>
    </a-form-item>
    <a-form-item label="Tên tài khoản" name="username" has-feedback>
      <a-input
          id="username"
          v-model:value="formState.username"
          placeholder="Nhập tên tài khoản"
          show-count
          allow-clear>
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
      <a-typography-text v-if="errorWhenUniqueUserAndEmail.username" type="danger">{{errorWhenUniqueUserAndEmail.username[0]}}</a-typography-text>
    </a-form-item>
    <a-form-item label="Mật khẩu" name="password" has-feedback>
      <a-input-password id="password" v-model:value="formState.password" placeholder="Nhập mật khẩu" allow-clear>
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item label="Mật khẩu xác nhận" name="passwordconfirm" has-feedback>
      <a-input-password id="passwordconfirm" v-model:value="formState.passwordconfirm" placeholder="Nhập mật khẩu xác nhận" allow-clear>
        <template #prefix>
          <LockOutlined />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item name="remember" :wrapper-col="{ offset: 4, span: 20 }">
      <a-flex>
        <a-checkbox
            v-model:checked="formState.remember"
        >
          Duy trì đăng nhập 30 ngày !
        </a-checkbox>
      </a-flex>
    </a-form-item>
    <a-form-item label="Thêm Avatar">
      <a-form-item name="dragger" no-style>
        <a-upload-dragger
          v-model:fileList="formState.dragger"
          name="files"
          :multiple="false"
          :before-upload="checkBeforeUpload"
          @change="changingUpload"
          list-type="picture-card"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">Kéo và thả Avatar vào đây hoặc click để chọn Avatar</p>
          <p class="ant-upload-hint">Chỉ nhận Avatar là các file .jpeg / .png / .jpg / .webp</p>
          <p class="ant-upload-hint">Chỉ nhận 1 hình, bạn có thể đổi hình khác sau</p>
        </a-upload-dragger>
      </a-form-item>
    </a-form-item>
    <a-flex justify="space-around">
      <a-button type="primary" html-type="submit" :disabled="disabled">Đăng ký</a-button>
      <router-link :to="{name: 'login'}">
        <a-button type="primary">Quay về đăng nhập</a-button>
      </router-link>
    </a-flex>
  </a-form>
  </a-modal>
</template>

<style scoped>
.ant-upload-hint{
  margin-bottom: 5px;
}
</style>