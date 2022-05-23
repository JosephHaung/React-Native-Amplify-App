import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AppCard({ title, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    // width: "80%",
    backgroundColor: "tomato",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  description: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
  },
});
