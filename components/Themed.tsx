/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  TextInput as DefaultTextInput,
  Pressable,
  ViewStyle
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

// Define a type for the supported icon names
type FontAwesomeIconName =
  | "save"
  | "refresh"
  | "search"
  | "plus"
  | "search"
  | "trash"
  | "print"
  // Add more icon names as needed
  ;

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type IconButtonArgs = {
  onPress?: () => void;
  style?: ViewStyle;
  iconName: FontAwesomeIconName;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ScrollViewProps = ThemeProps & DefaultScrollView['props'];
export type IconButtonProps = ThemeProps & IconButtonArgs;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, fontSize: 18 }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultTextInput style={[
    {
      backgroundColor, borderColor, borderWidth: 1,
      fontSize: 18, color: textColor, padding: 10,
      borderRadius: 5
    },
    style]} {...otherProps} />;
}

export function IconButton(props: IconButtonProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

   return (
    <Pressable
      style={{
        backgroundColor: "red",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        padding: 10,
        borderRadius: 5
      }}
      onPress={props.onPress}
    >
      {({ pressed }) => (
        <FontAwesome
          size={25}
          name={props.iconName}
          color={textColor}
          style={{ opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  )

}