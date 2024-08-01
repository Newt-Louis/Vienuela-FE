import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {notification} from "ant-design-vue";
import {useRouter} from "vue-router";
import axios from "axios";

export const useUserStore = defineStore('user',() => {
  const router = useRouter();
  const userStore = ref({})
  const userState = ref({
    isLoggedIn: false,
  });
  async function fetchUserByToken() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user')
      setUser(response.data)
      /*notification.success({
        message: 'Xin chào '+response.data.name_user,
        placement: "topRight",
      })*/
      sessionStorage.setItem('set_session', 'true');
    } catch (error) {
      notification.error({
        message: 'Duy trì đăng nhập đã hết hiệu lực !',
        description: error.response.data.message,
        placement: "topRight",
      })
      userState.value.isLoggedIn = false;
      userStore.value = {};
      sessionStorage.setItem('set_session', 'false');
      await router.push({name: 'default_homepage'})
      console.log(axios.defaults.headers.common)
    }
  }
  const getUserLogin = async (dataLoginRequest) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/login',dataLoginRequest);
      if (response.status === 200){
        setUser(response.data.user);
        if (response.data.expired === true) {
          localStorage.setItem('user_token',response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } else {
          sessionStorage.setItem('temporary_token',response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        sessionStorage.setItem('set_session', 'true');
        await router.push({name: 'default_homepage'});
        notification.success({
          message: 'Xin chào '+response.data.user.name_user,
          placement: "topRight",
        })
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra, không đăng nhập được !',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }
  async function getUserLogout (user) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/logout',user);
      if (response.status === 200){
        localStorage.clear();
        sessionStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
        await router.push({name: 'login'});
        userStore.value = {};
        userState.value.isLoggedIn = false;
        notification.success({
          message: 'Đăng xuất thành công!',
          description: 'Hẹn gặp lại '+ user.name_user,
          placement: "topRight",
        })
      }
    } catch (error) {
      console.log(error.response);
      notification.error({
        message: 'Lỗi kết nối với máy chủ đường dẫn đăng xuất !',
        description: error.response.data.message,
        placement: "topRight",
      })
    }
  }

  async function registerUser (user) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register', user);
      if (response.status === 200) {
        setUser(response.data.user);
        if (response.data.expired === false){
          sessionStorage.setItem('temporary_token',response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } else {
          localStorage.setItem('user_token',response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        sessionStorage.setItem('set_session', 'true');
        await router.push({name: 'default_homepage'});
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi kết nối máy chủ, đăng ký không thành công !!!',
        placement: "topRight",
      })
      throw error;
    }
  }
  const setUser = (user) => {
    userStore.value = user;
    userState.value.isLoggedIn = true;
  };
  return { userState,userStore,fetchUserByToken,getUserLogin,getUserLogout,setUser,registerUser };
})