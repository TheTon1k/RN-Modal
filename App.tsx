import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReanimatedModalView } from './src/components';
import { Button, View } from 'react-native';
import { useModal } from './src/hooks';

const App = () => {
  const { showModal, setShowModal } = useModal();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title={'openModal'}
          onPress={() => setShowModal(true)}
        />
        <ReanimatedModalView
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
