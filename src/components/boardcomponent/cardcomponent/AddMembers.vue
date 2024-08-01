<script setup>
import {nextTick, onMounted, ref} from 'vue'
import {PlusOutlined,CloseOutlined} from "@ant-design/icons-vue";

const value = ref('');
const options = ref([]);
const initLoading = ref(true);
const loading = ref(false);
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const data = ref([]);
const list = ref([]);

onMounted(() => {
  fetch(fakeDataUrl)
      .then(res => res.json())
      .then(res => {
        initLoading.value = false;
        data.value = res.results;
        list.value = res.results;
      });
});
const onLoadMore = (event) => {
  event.stopPropagation();
  loading.value = true;
  list.value = data.value.concat(
      [...new Array(count)].map(() => ({
        loading: true,
        name: {},
        picture: {},
      })),
  );
  fetch(fakeDataUrl)
      .then(res => res.json())
      .then(res => {
        const newData = data.value.concat(res.results);
        loading.value = false;
        data.value = newData;
        list.value = newData;
        nextTick(() => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        });
      });
};
const handelInputClick = (event) => {
  event.stopPropagation();
}
const handleAddButton = (event) => {
  event.stopPropagation();
}
const handleSearch = val => {
  let res;
  if (!val || val.indexOf('@') >= 0) {
    res = [];
  } else {
    res = ['gmail.com', '163.com', 'qq.com'].map(domain => ({
      value: `${val}@${domain}`,
    }));
  }
  options.value = res;
};
const filterOption = (input, option) => {
  return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};
</script>

<template>
<!--Chỉ những members nào có khóa ngoại là id của user đang đăng nhập đồng nghĩa với
    user đó đã được tham gia vào workspace của user đang đăng nhập hoặc là 1 thành viên
    trong 1 board bất kỳ của user đang đăng nhập thì mới có tên trong component này
    và được thêm vào trong card chỉ định.
-->
  <div>
    <a-typography-title :level="5">Thành viên của thẻ này</a-typography-title>
    <!--                <a-avatar-group> dùng để nhóm các thẻ <a-avatar> nằm trong <a-tooltip>-->
    <a-avatar-group>
      <!--                  Sử dụng vòng lặp để render các members có trong id của card, v-for cho <a-tooltip/>
                            Vì khi bọc tooltip vô avatar thì lúc hover vào avatar sẽ hiển thị email của người dùng.
      -->
      <a-tooltip placement="bottom" color="purple" class="email-member">
        <template #title>
          <span>{Email của user sở hữu Avatar}</span>
        </template>
        <a-avatar src="" style="background-color: orangered">{Ava}</a-avatar>
      </a-tooltip>
      <!--    Đối với nút button sẽ sử dụng hàm để thêm thành viên vào trong card hiện tại
              Thêm thành viên sẽ là 1 component con
      -->
      <a-tooltip placement="bottom" color="purple">
        <template #title>Thêm thành viên</template>
<!--        <a-button shape="circle">
          <PlusOutlined/>
        </a-button>-->
        <a-dropdown :trigger="['click']" :placement="'bottomLeft'" :arrow="{pointAtCenter: true}">
          <a-button shape="circle">
            <PlusOutlined/>
          </a-button>
          <template #overlay>
            <a-card size="small" title="Thành viên trong bảng" style="width: 300px">
<!--              Autocomplete sẽ tự động tìm ký tự khớp với tên tài khoản nhất-->
              <a-auto-complete
                  @click="handelInputClick"
                  v-model:value="value"
                  style="width: 266px"
                  placeholder="Tìm nhanh tên thành viên"
                  :options="options"
                  @search="handleSearch"
                  allow-clear
                  :filter-option="filterOption"
              >
                <template #clearIcon>
                  <CloseOutlined />
                </template>
                <template #option="{ value: val }">
                  {{ val.split('@')[0] }} @
                  <span style="font-weight: bold">{{ val.split('@')[1] }}</span>
                </template>
              </a-auto-complete>
              <a-divider dashed style="margin-top: 10px"></a-divider>
              <a-list
                  class="demo-loadmore-list"
                  :loading="initLoading"
                  item-layout="horizontal"
                  :data-source="list"
                  size="small"
              >
                <template #loadMore>
                  <div
                      v-if="!initLoading && !loading"
                      :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                  >
                    <a-button @click="onLoadMore">Xem thêm</a-button>
                  </div>
                </template>
                <template #renderItem="{ item }">
                  <a-list-item class="member-add-list">
                    <template #actions>
                      <a-button type="text" shape="circle" @click="handleAddButton"><PlusOutlined/></a-button>
                    </template>
                    <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                      <a-list-item-meta>
                        <template #title>
                          <a href="https://www.antdv.com/">{{ item.name.last }}</a>
                        </template>
                        <template #avatar>
                          <a-avatar :src="item.picture.large" />
                        </template>
                      </a-list-item-meta>
                    </a-skeleton>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </template>
        </a-dropdown>
      </a-tooltip>
    </a-avatar-group>
  </div>
</template>

<style scoped>
.email-member:hover{
  cursor: default;
  opacity: 0.7;
}
.member-add-list:hover{
  background-color: gainsboro;
}
</style>