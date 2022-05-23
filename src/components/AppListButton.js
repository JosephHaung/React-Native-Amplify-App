import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AppListButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text />
      <Text style={styles.buttonText}>{title}</Text>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color="#6e6869"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    backgroundColor: "grey",
    borderTopWidth: 1,
    borderColor: "#CCCAC8",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  icon: {
    position: "absolute",
    right: 5,
  },
});
