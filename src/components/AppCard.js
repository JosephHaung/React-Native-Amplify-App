import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function AppCard({ title, description, imageKey }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={{
          uri: imageKey,
        }}
        style={styles.image}
      />
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
  image: {
    width: 100,
    height: 100,
  },
});
