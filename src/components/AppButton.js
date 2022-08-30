import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

export default function AppButton({
  title,
  onPress,
  style,
  bgColor = colors.primary,
  textColor = colors.background,
  leftIcon,
}) {
  return (
    <TouchableOpacity
      style={[styles(bgColor).button, style, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {leftIcon}
      <Text style={[styles(bgColor).buttonText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = (bgColor) =>
  StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2.54,
      elevation: 3,
      // width: "100%",
      borderRadius: 10,
      padding: 10,
      flexDirection: "row",
    },
    buttonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
      // textTransform: "uppercase",
    },
  });
