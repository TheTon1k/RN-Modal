import { FC } from 'react';
import { Button, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { screenHeight, withDelayTimingAnimation, withTimingAnimation } from '../utils';

interface ReanimatedModalViewProps {
  showModal: SharedValue<boolean>;
  setShowModal: (state: boolean) => void;
  backdropOpacity?: number;
  paddingTop?: number;
  height?: number;
  borderRadius?: number;
}

export const ReanimatedModalView: FC<ReanimatedModalViewProps> = ({
  showModal,
  setShowModal,
  backdropOpacity = 0.7,
  paddingTop = 100,
  // height = screenHeight,
  height = 200,
  borderRadius = 24,
}) => {
  const top = useSharedValue(0);
  const backdrop = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      top: top.value,
    };
  }, [top.value]);

  const backdropStyle = useAnimatedStyle(() => {
    const step = height / 100;
    console.log('top.value', (screenHeight - top.value) / step / 100 / 100);
    return {
      top: backdrop.value,
      opacity: backdropOpacity - (screenHeight - top.value) / step / 100,
    };
  }, [backdrop.value, top.value]);

  useAnimatedReaction(
    () => {
      return showModal.value;
    },
    isOpening => {
      if (isOpening) {
        withTimingAnimation(top, screenHeight - height);
        withTimingAnimation(backdrop, 0, 0);
      }
    },
    [showModal.value],
  );

  const onCloseModal = () => {
    'worklet';
    withTimingAnimation(top, screenHeight);
    withDelayTimingAnimation(backdrop, screenHeight, 300, 0);

    setShowModal(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(e, context: { top: number }) {
      context.top = top.value;
    },
    onActive(e, context) {
      const res = context.top + e.translationY;
      if (res > screenHeight - height) {
        top.value = context.top + e.translationY;
      }
    },
    onEnd() {
      if (top.value >= screenHeight - height / 1.5) {
        onCloseModal();
      } else {
        withTimingAnimation(top, screenHeight - height);
      }
    },
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <Animated.View
          style={[
            {
              flex: 1,
              backgroundColor: '#000',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: screenHeight,
            },
            backdropStyle,
          ]}
        />
      </TouchableWithoutFeedback>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: screenHeight,
              backgroundColor: '#EEE',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              height: height || 'auto',
            },
            style,
          ]}
        >
          <Text>asdqwe</Text>
          <Button
            title={'Close'}
            onPress={onCloseModal}
          />
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
    // top: dimensions.height,
  },
});
