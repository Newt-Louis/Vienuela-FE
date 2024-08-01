import {ref,reactive,computed} from "vue";
import {useCardStore} from "../store/crudcard.js";

export function useCardLogic(props){
  const cards = useCardStore();
  const isAddButton = reactive({
    isLabel: false,
    isCheckList: false,
    isDueDate: false,
    isAttachment: false,
  });
  const isUpdateInputTitleCard = reactive({
    whenTitleCardUpdated: false,
    inputTitleCard: '',
    inputStatusUpdateTitleCard: computed(() => cards.stateCardStore.isInputStatusUpdateTitleCard),
    dataErrorUpdateTitleCard: computed(() => cards.stateCardStore.dataErrorUpdateTitleCard)
  })
  const modalVisible = ref(false);


  const renameTitleThisCard = async (newTitleCard) => {
    let dataUpdatedTitleCard = reactive({
      idCard: props.idCard,
      titleCard: newTitleCard,
    })
    await cards.updateTitleThisCard(dataUpdatedTitleCard);
    if (isUpdateInputTitleCard.inputTitleCard === ''){
      isUpdateInputTitleCard.whenTitleCardUpdated = true;
    } else {
      isUpdateInputTitleCard.inputTitleCard = '';
      isUpdateInputTitleCard.whenTitleCardUpdated = false;
    }
  }
  const setModalVisible = (open) => {
    modalVisible.value = !modalVisible.value;
  };
  const confirmSoftDelete = idCard => {
    cards.softDeleteACard(idCard);
  };

  return {
    isAddButton,
    isUpdateInputTitleCard,
    modalVisible,
    renameTitleThisCard,
    setModalVisible,
    confirmSoftDelete,
  }
}