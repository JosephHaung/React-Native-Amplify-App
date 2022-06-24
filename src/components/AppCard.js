import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Image, Linking } from "react-native";
import { SignUpMethod } from "../models";
import AppButton from "./AppButton";

export default function AppCard({ item }) {
  const { title, description, imageKeys, signUpMethod, page, formLink } = item;
  const navigation = useNavigation();

  const onPressRegister = () => {
    switch (signUpMethod) {
      case SignUpMethod.APP_FORM:
        navigation.navigate(page + "Form");
        break;
      case SignUpMethod.CALENDAR:
        navigation.navigate("CalendarForm");
        break;
      case SignUpMethod.GOOGLE_FORM:
        Linking.openURL(formLink);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={{
          uri: imageKeys[0],
        }}
        style={styles.image}
      />
      <Text style={styles.description}>{description}</Text>
      <AppButton title="我要報名" onPress={onPressRegister} />
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
