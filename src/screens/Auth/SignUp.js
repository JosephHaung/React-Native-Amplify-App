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

  const signUp = async () => {
    if (password !== confirmPassword) {
      return;
    }
    try {
      const user = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          email: email,
          phone_number: "+886" + number,
        },
      });
      console.log(user);
      navigation.navigate("ConfirmSignUp", { username: email });
    } catch (error) {
      console.log("error signing up", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello World!</Text>
      <AppTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="輸入Email"
        autoCapitalize="none"
        textContentType="username"
        leftIcon="account"
      />
      <AppTextInput
        value={number}
        onChangeText={setNumber}
        placeholder="輸入電話"
        autoCapitalize="none"
        textContentType="telephoneNumber"
        keyboardType="number-pad"
        leftIcon="cellphone"
      />
      <AppTextInput
        value={password}
        onChangeText={setPassword}
        placeholder="輸入密碼"
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        leftIcon="lock"
      />
      <AppTextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="再次輸入密碼"
        autoCapitalize="none"
        secureTextEntry
        leftIcon="lock"
      />
      <AppButton title="註冊" onPress={signUp} />
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.forgotPasswordButtonText}>已有帳號？登入</Text>
        </TouchableOpacity>
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
