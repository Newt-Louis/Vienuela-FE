import {createRouter, createWebHistory} from "vue-router";
import logorregis from "./LoginOrRegister.js";
import homepagevienuelaroutes from "./homepagevienuela.js";
import boardvienuelaroutes from './boardvienuela.js';
import {useUserStore} from "../store/userstorelog.js";

const router = createRouter({
  history: createWebHistory(),
   routes: [...homepagevienuelaroutes, ...boardvienuelaroutes, ...logorregis],
});

router.beforeEach(async (to,from,next) => {
  const userStores = useUserStore();
  const checkSession = sessionStorage.getItem('set_session');
  const checkTemporaryToken = sessionStorage.getItem('temporary_token');
  const checkLocalStorageToken = localStorage.getItem('user_token');
  if (to.matched.some(record => record.meta.requiresAuth) && !userStores.userState.isLoggedIn){
    if (checkLocalStorageToken){
      await userStores.fetchUserByToken();
      next();
    } else if (checkTemporaryToken){
      await userStores.fetchUserByToken();
      next();
    } else {
      next({name: 'login'});
    }
  } else {
    if (checkSession === 'true' && to.fullPath === '/login'){
      next({name: 'default_homepage'});
    } else {
      next();
    }
  }
})
export default router;