import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import colors from "../../theme/colors";

export default SignIn = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const phoneInput = useRef();
  const nameInput = useRef();
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();

  const navigation = useNavigation();

  const signUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("密碼不相同");
      return;
    }
    if (!email || !number || !name) {
      setErrorMessage("所有欄位皆為必填");
      return;
    }
    try {
      const user = await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          email: email,
          phone_number: "+886" + number,
          name: name,
        },
      });
      navigation.navigate("ConfirmSignUp", {
        username: email,
        password: password,
      });
    } catch (error) {
      setErrorMessage("註冊失敗，請檢查所有欄位");
      console.log("error signing up", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "85%",
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "600",
              marginBottom: 5,
              // textAlign: "left",
              // width: "85%",
            }}
          >
            註冊
          </Text>

          {/* <AppButton
          leftIcon={<AntDesign name="back" size={20} color={"#000"} />}
          onPress={() => navigation.goBack()}
          bgColor={colors.background}
          style={{ shadowColor: "#000", shadowOpacity: 0.15 }}
          // textColor="#fff"
          // style={{ width: "85%", marginTop: 20 }}
        /> */}
        </View>
        <AppTextInput
          value={email}
          onChangeText={(email) => {
            setEmail(email);
            setErrorMessage(null);
          }}
          placeholder="Email"
          autoCapitalize="none"
          textContentType="username"
          leftIcon="email-outline"
          returnKeyType="next"
          onSubmitEditing={() => {
            phoneInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={number}
          onChangeText={(number) => {
            setNumber(number);
            setErrorMessage(null);
          }}
          placeholder="電話"
          autoCapitalize="none"
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          leftIcon="cellphone"
          ref={phoneInput}
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          onSubmitEditing={() => {
            nameInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={name}
          onChangeText={(name) => {
            setName(name);
            setErrorMessage(null);
          }}
          placeholder="姓名"
          autoCapitalize="none"
          textContentType="name"
          leftIcon="account"
          ref={nameInput}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={password}
          onChangeText={(pwd) => {
            setPassword(pwd);
            setErrorMessage(null);
          }}
          placeholder="密碼"
          autoCapitalize="none"
          secureTextEntry
          textContentType="password"
          leftIcon="lock"
          ref={passwordInput}
          returnKeyType="next"
          onSubmitEditing={() => {
            confirmPasswordInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={confirmPassword}
          onChangeText={(confirmPassword) => {
            setConfirmPassword(confirmPassword);
            setErrorMessage(null);
          }}
          placeholder="確認密碼"
          autoCapitalize="none"
          secureTextEntry
          textContentType="password"
          leftIcon="lock"
          ref={confirmPasswordInput}
        />
        {errorMessage && (
          <Text style={{ fontSize: 14, color: "red", marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
        <AppButton
          title="註冊"
          onPress={signUp}
          style={{ marginTop: 10, width: "85%" }}
        />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.forgotPasswordButtonText}>已有帳號？登入</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  footerButtonContainer: {
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
