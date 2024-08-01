import {defineStore} from "pinia";
import {ref} from "vue";
import {useListStore} from "../cruddlist.js";
import {useCardStore} from "../crudcard.js";

export const useMoveStore = defineStore('moved',() => {
  const listsStores = useListStore();
  const cardsStores = useCardStore();
  const defineIdList = ref();
  const instanceCardChangeList = ref({});
  const newListDataWhenAdded = ref([]);
  const oldListDataWhenRemoved = ref([]);
  const dataUpdatedCardMovedInList = ref([]);

  async function updatePositionList(dataPosition) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/list/moved_in_board',dataPosition);
    } catch (e) {
      console.log(e);
    }
  }
  async function updatePositionCardInList(newIndex,oldIndex) {
    try {
      await new Promise(resolve => {
        for (let i = Math.min(newIndex, oldIndex); i <= Math.max(newIndex, oldIndex); i++) {
          dataUpdatedCardMovedInList.value[i].positionCard = i + 1;
        }
        resolve();
      })
      cardsStores.updateCardMoved(defineIdList, dataUpdatedCardMovedInList);
    } catch (e) {
      console.log(e)
    }
        try {
          const  response = await axios.post('http://127.0.0.1:8000/api/card/moved_in_list',dataUpdatedCardMovedInList.value);
          if (response.status === 200){
            defineIdList.value = '';
            dataUpdatedCardMovedInList.value = [];
          }
        } catch (e) {
          console.log(e);
        }
  }
  async function updatePositionCardChangeList(newIndex,oldIndex,oldIdList) {
    oldListDataWhenRemoved.value = cardsStores.cardsStore[oldIdList];
    newListDataWhenAdded.value = cardsStores.cardsStore[defineIdList.value];
    instanceCardChangeList.value.idList = defineIdList.value;
    if (newIndex === (newListDataWhenAdded.value.length - 1)){
      newListDataWhenAdded.value[newIndex].idList = defineIdList.value;
      newListDataWhenAdded.value[newIndex].positionCard = newIndex + 1;
      cardsStores.updateCardMoved(defineIdList,newListDataWhenAdded.value);
    } else {
      try {
        await new Promise(resolve => {
          for (let i = newIndex; i < newListDataWhenAdded.value.length; i++) {
            newListDataWhenAdded.value[i].positionCard = i + 1;
          }
          resolve();
        })
        cardsStores.updateCardMoved(defineIdList, newListDataWhenAdded.value);
      } catch (e) {
        console.log(e);
      }
    }
    if (oldIndex === oldListDataWhenRemoved.value.length){
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/card/moved_change_list',{
          instanceCardUpdated:instanceCardChangeList.value,
          newList:newListDataWhenAdded.value,
        });
        console.log(response);
        if (response.status === 200){
          newListDataWhenAdded.value = [];
          oldListDataWhenRemoved.value = [];
          defineIdList.value = '';
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await new Promise(resolve => {
          for (let i = oldIndex; i < oldListDataWhenRemoved.value.length; i++) {
            oldListDataWhenRemoved.value[i].positionCard = i + 1;
          }
          resolve();
        })
        cardsStores.updateCardMoved(defineIdList, oldListDataWhenRemoved.value);
      } catch (e) {
        console.log(e);
      }
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/card/moved_change_list',{
          instanceCardUpdated:instanceCardChangeList.value,
          newList:newListDataWhenAdded.value,
          oldList:oldListDataWhenRemoved.value,
          })
        console.log(response);
        if (response.status === 200){
          newListDataWhenAdded.value = [];
          oldListDataWhenRemoved.value = [];
          defineIdList.value = '';
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
  return {
    defineIdList,
    instanceCardChangeList,
    newListDataWhenAdded,
    oldListDataWhenRemoved,
    dataUpdatedCardMovedInList,
    updatePositionList,
    updatePositionCardInList,
    updatePositionCardChangeList,
  }

})