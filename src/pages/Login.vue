<script setup>
import {UserOutlined,LockOutlined} from '@ant-design/icons-vue';
import { reactive, computed, ref } from 'vue';
import {useUserStore} from "../store/userstorelog.js";
import axios from "axios";

const userStores = useUserStore();
const formRef = ref();
const formState = reactive({
  username: '',
  userpassword: '',
  userpasswordconfirm: '',
  remember: true,
});
const validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Chưa nhập mật khẩu !');
  } else{
    if (formState.userpasswordconfirm !== '') {
      formRef.value.validateFields('userpasswordconfirm');
    }
    return Promise.resolve();
  }
}
const validatePassConfirm = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Chưa nhập mật khẩu xác nhận !');
  } else if (value !== formState.userpassword) {
    return Promise.reject('Mật khẩu xác nhận không khớp !');
  } else {
    return Promise.resolve();
  }
}
const rules = {
  username: [
    {
      required: true,
      message: 'Chưa nhập tên tài khoản !',
      trigger: 'change'
    },
    {
      max: 25,
      message: 'Tài khoản tối đa 25 ký tự !',
      trigger: 'change'
    }
  ],
  userpassword: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
  userpasswordconfirm: [
    {
      required: true,
      validator: validatePassConfirm,
      trigger: 'change',
    }
  ]
}
const onLoginSuccess = values => {
  let dataRequestToLogin = {
    username: values.username,
    userpassword: values.userpassword,
    passwordconfirm: values.userpasswordconfirm,
    remember: formState.remember,
  }
  userStores.getUserLogin(dataRequestToLogin);
};
const onLoginFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const disabled = ref(true);
const fieldStatus = ref({
  usernameValid: false,
  userpasswordValid: false,
  userpasswordconfirmValid: false,
})
const validateLoginForm = (...argument) => {
  let [field,isValid] = argument;

  if (field === 'username') {
    fieldStatus.value['usernameValid'] = isValid;
  } else if (field === 'userpassword'){
    fieldStatus.value['userpasswordValid'] = isValid
  } else if (field === 'userpasswordconfirm') {
    fieldStatus.value['userpasswordconfirmValid'] = isValid;
  }
  disabled.value = !Object.values(fieldStatus.value).every(status => status);
}
</script>

<template>
  <a-modal :open="true" centered :closable="false" :footer="null" :width="640">
    <template #title>
      <a-flex vertical align="center">
        <a-typography-title style="margin: 0; padding: 15px 0 0 0; font-weight: bold">
          <img style="border-radius: 8px" src="/clonetrello.png" alt="" width="60px" height="60px"> Vienuela
        </a-typography-title>
        <a-typography-title style="margin: 20px 0 10px 0" :level="3" type="secondary">Đăng nhập</a-typography-title>
      </a-flex>
    </template>
    <a-form
        ref="formRef"
        label-align="left"
        :label-col="{ span: 6}"
        :wrapper-col="{ span: 20 }"
        :model="formState"
        :rules="rules"
        name="normal_login"
        class="login-form"
        @finish="onLoginSuccess"
        @finishFailed="onLoginFailed"
        @validate="validateLoginForm"
    >
      <a-form-item
          label="Tên tài khoản"
          name="username"
          has-feedback
      >
        <a-input v-model:value="formState.username" show-count allow-clear>
          <template #prefix>
            <UserOutlined class="site-form-item-icon"/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          label="Mật khẩu"
          name="userpassword"
          has-feedback
      >
        <a-input-password v-model:value="formState.userpassword" allow-clear id="userpassword">
          <template #prefix>
            <LockOutlined class="site-form-item-icon"/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
          label="Mật khẩu xác nhận"
          name="userpasswordconfirm"
          has-feedback
      >
        <a-input-password v-model:value="formState.userpasswordconfirm" allow-clear id="userpasswordconfirm">
          <template #prefix>
            <LockOutlined class="site-form-item-icon"/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-flex>
          <a-checkbox
            style="border-right: 1px solid black"
            v-model:checked="formState.remember"
          >
            Duy trì đăng nhập 30 ngày !
          </a-checkbox>
          <a class="login-form-forgot" href="">Quên mật khẩu?</a>
        </a-flex>
      </a-form-item>

      <a-form-item style="justify-content: space-around">
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Đăng nhập
        </a-button>
        <a-typography-text style="margin: 0 20px 0 20px">Hoặc</a-typography-text>
        <router-link :to="{name: 'register'}"><a href="">Đăng ký ngay !</a></router-link>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.login-form-forgot{
  margin-left: 10px;
}
.login-form-button{
  width: 100%;
}
</style>