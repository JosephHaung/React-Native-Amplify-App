import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";

export default ConfirmSignUp = ({ route }) => {
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  const confirmSignUp = async () => {
    try {
      const user = await Auth.confirmSignUp(route.params.username, code);
      console.log(user);
      navigation.navigate("Home");
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello World!</Text>
      <AppTextInput
        value={code}
        onChangeText={setCode}
        placeholder="輸入驗證碼"
        autoCapitalize="none"
        textContentType="telephoneNumber"
        keyboardType="number-pad"
        leftIcon="account"
      />
      <AppButton title="註冊" onPress={confirmSignUp} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordButtonText: {
    color: "tomato",
    fontSize: 18,
    fontWeight: "600",
  },
});
