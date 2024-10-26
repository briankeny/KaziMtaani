import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

type HelloProps ={
  helloStyle:StyleProp<ViewStyle>;
  helloStyleText:StyleProp<TextStyle>;
}

export function HelloWave({helloStyle,helloStyleText}:HelloProps) {
  const rotationAnimation = useSharedValue(0);

  rotationAnimation.value = withRepeat(
    withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle,helloStyle]}>
      <ThemedText style={helloStyleText}>👋</ThemedText>
    </Animated.View>
  );
}

