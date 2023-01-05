import { SharedValue, withDelay, withTiming } from 'react-native-reanimated';

export const withTimingAnimation = (sharedValue: SharedValue<number>, value: number, duration: number = 300) => {
  'worklet';
  sharedValue.value = withTiming(value, { duration: duration });
};
export const withDelayTimingAnimation = (
  sharedValue: SharedValue<number>,
  value: number,
  delay: number,
  duration: number = 300,
) => {
  'worklet';
  sharedValue.value = withDelay(delay, withTiming(value, { duration }));
};
