<script setup>
import {useUserStore} from "./store/userstorelog.js";
import {message} from 'ant-design-vue';
import {ref} from "vue";
import { Button } from "ant-design-vue";

//  Nhận thông tin đăng nhập thành công từ người dùng
const signIn = async () => {
  const userStore = useUserStore()
  const response = await axios.post('http://127.0.0.1:8000/api/signin',{
    id_user: this.id_user,
    account_user: this.account_user,
    password_user: this.password_user,
  })
  if (response.data.user) {
    userStore.setUser(response.data.user)
  } else {
    message.error('Tài khoản không tồn tại!!');
  }
}

/*get dữ liệu từ server về sau đó sử dụng reduce() để tạo ra 1 mảng ref mới với
* cách sắp xếp mảng đó là mỗi đối tượng sẽ có 1 thuộc tính label để làm id khóa chính,
* và 1 thuộc tính khác là options, thuộc tính options này lại là 1 mảng  chứa các đối tượng,
* với 2 thuộc tính trong mỗi đối tượng này là value và label.
* Sau đó với mỗi dòng dữ liệu nếu đúng với label đang có thì thêm nó vào thuộc tính thứ 2,
* với key có sẵn là value và label và giá trị sẽ là dữ liệu mình muốn trong cơ sở dữ liệu,
* ngược lại nếu không tìm thấy label tương ứng của đối tượng trong mảng ngoài thì sẽ tự tạo thêm
* 1 đối tượng mới với tên là phân loại mà mình mong muốn trong cơ sở dữ liệu, và đối tượng bên trong
* mảng thuộc tính lại tạo key là value và label tương ứng.
* Lý do khi cùng là 1 phương thức sinh ra mảng mới là map() mà lại sử dụng reduce() là:
* map() sẽ áp dụng phương thức lên mỗi 1 phần tử của mảng hiện tại để tạo ra mảng mới.
* reduce() sẽ tốt hơn trong việc gộp các giá trị, hoặc thay đổi cấu trúc dũ liệu của 1 mảng.
* phần quyết định chính trong reduce() đó chính là tham số đầu tiên trong phương thức được xem là
* tham số đầu tiên của hàm reduce() tham số này là total như trong tài liệu w3school chỉ, hay còn gọi
* nó dễ hiểu hơn là tham số accumulator cho phép chúng ta tích lũy kết quả và tạo ra cấu trúc dữ liệu
* phúc tạp hơn.
* */

const workspaceBelongToUser = ref([]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users')
    const users = response.data

    workspaceBelongToUser.value = users.reduce((acc, user) => {
      const existingGroup = acc.find(group => group.label === user.role)
      /*biến existingGroup đang lấy thuộc tính options trong mảng của acc chứ không phải options của ref()*/
      if (existingGroup) {
        existingGroup.options.push({
          value: user.username,
          label: user.name,
        })
      } else {
        acc.push({
          label: user.role,
          options: [
            {
              value: user.username,
              label: user.name,
            },
          ],
        })
      }

      return acc
    }, [])
  } catch (error) {
    console.error(error)
  }
}

fetchUsers()
</script>
<template>
  <div class="container">
    <ul>
      <li class="some-style"></li>
      <li class="some-style"></li>
      <li class="some-style"></li>
      <li class="some-style"></li>
      <li class="some-style"></li>
    </ul>
    <audio src=""></audio>
    <button src="" @click="fetchUsers()"></button>
    <a-typography></a-typography>
    <a-button></a-button>
  </div>
</template>