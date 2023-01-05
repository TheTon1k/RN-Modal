import { FC } from 'react';
import { Button, Text, TouchableWithoutFeedback } from 'react-native';
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
  backdropColor?: string;
}

export const ReanimatedModalView: FC<ReanimatedModalViewProps> = ({
  showModal,
  setShowModal,
  backdropOpacity = 0.7,
  height = 400,
  borderRadius = 24,
  backdropColor = '#000',
}) => {
  const bottom = useSharedValue(-height);
  const backdrop = useSharedValue(-screenHeight);

  const modalStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      right: 0,
      left: 0,
      backgroundColor: '#EEE',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: bottom.value,
      height: height || 'auto',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
    };
  }, [bottom.value]);

  const backdropStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      position: 'absolute',
      top: backdrop.value,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: backdropOpacity - -bottom.value / height,
      backgroundColor: backdropColor,
    };
  }, [backdrop.value, bottom.value]);

  useAnimatedReaction(
    () => {
      return showModal.value;
    },
    isOpening => {
      if (isOpening) {
        withTimingAnimation(bottom, 0);
        withTimingAnimation(backdrop, 0, 0);
      }
    },
    [showModal.value],
  );

  const onCloseModal = () => {
    'worklet';
    withTimingAnimation(bottom, -height);
    withDelayTimingAnimation(backdrop, screenHeight, 300, 0);

    setShowModal(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(e, context: { bottom: number }) {
      context.bottom = bottom.value;
    },
    onActive(e, context) {
      const res = context.bottom - e.translationY;
      if (res < 0) {
        bottom.value = res;
      }
    },
    onEnd() {
      if (-bottom.value >= height / 2.5) {
        onCloseModal();
      } else {
        withTimingAnimation(bottom, 0);
      }
    },
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <Animated.View style={backdropStyle} />
      </TouchableWithoutFeedback>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={modalStyle}>
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
