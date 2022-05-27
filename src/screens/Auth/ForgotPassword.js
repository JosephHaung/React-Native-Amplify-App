import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";

export default SignIn = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const forgotPassword = async () => {
    try {
      const data = await Auth.forgotPassword(email);
      console.log(data);
      //   console.log(user);
      //   navigation.navigate("ConfirmSignUp", { username: email });
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="輸入Email"
        autoCapitalize="none"
        textContentType="username"
        leftIcon="account"
      />

      <AppButton title="確認" onPress={forgotPassword} />
      <View style={styles.footerButtonContainer}>
        {/* <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.forgotPasswordButtonText}>已有帳號？登入</Text>
        </TouchableOpacity> */}
      </View>
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
