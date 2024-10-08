import { View, type ViewProps } from 'react-native';
import { useSelector } from 'react-redux';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
 const {theme} = useSelector((state:any)=>state.theme)

  return <View style={[{backgroundColor:theme.backgroundColor}, style]} {...otherProps} />;
}
