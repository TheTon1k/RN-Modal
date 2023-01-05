import { useSharedValue } from 'react-native-reanimated';

export const useModal = () => {
  const showModal = useSharedValue(false);

  return {
    showModal: showModal,
    setShowModal(status: boolean) {
      'worklet';
      showModal.value = status;
    },
  };
};
