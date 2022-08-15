import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import { Auth } from "aws-amplify";

export default User = ({ route }) => {
  const navigation = useNavigation();
  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate("Home");
    } catch (error) {
      console.log("error signing out: ", error);
      Alert.alert("登出失敗，請檢查連線");
    }
  }
  return (
    <View style={styles.container}>
      {route.params.user ? (
        <AppButton
          title="SignOut"
          onPress={() => {
            signOut();
          }}
        />
      ) : (
        <AppButton
          title="SignIn"
          onPress={() => navigation.navigate("SignIn")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    flex: 1,
    backgroundColor: colors.background,
    height: "100%",
    padding: 20,
  },
  section: {
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    // padding: 20,
    backgroundColor: colors.background,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    display: "flex",
  },
});
