import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";

export default ResetPassword = ({ route }) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(null);
  const confirmPasswordInput = useRef();
  const codeInput = useRef();

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("密碼不相同");
      return;
    }
    try {
      const data = await Auth.forgotPasswordSubmit(
        route.params.username,
        code,
        password
      );
      //   console.log(user);
      navigation.navigate("SignIn", { username: route.params.username });
    } catch (error) {
      console.log("error signing up", error);
      setErrorMessage("發生錯誤，請稍後再試");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "600",
            textAlign: "left",
            width: "85%",
          }}
        >
          重設密碼
        </Text>
        <AppTextInput
          value={password}
          onChangeText={(pwd) => {
            setPassword(pwd);
            setErrorMessage(null);
          }}
          placeholder="新密碼"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry
          leftIcon="lock"
          returnKeyType="next"
          onSubmitEditing={() => {
            confirmPasswordInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={confirmPassword}
          onChangeText={(pwd) => {
            setConfirmPassword(pwd);
            setErrorMessage(null);
          }}
          placeholder="確認新密碼"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry
          leftIcon="lock"
          ref={confirmPasswordInput}
          returnKeyType="next"
          onSubmitEditing={() => {
            codeInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={code}
          onChangeText={(code) => {
            setCode(code);
            setErrorMessage(null);
          }}
          placeholder="六位數驗證碼"
          autoCapitalize="none"
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          leftIcon="account"
          ref={codeInput}
        />
        {errorMessage && (
          <Text style={{ fontSize: 14, color: "red", marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
        <AppButton
          title="確認"
          onPress={resetPassword}
          style={{ marginTop: 10, width: "85%" }}
        />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity
            onPress={() => Auth.resendSignUp(route.params.username)}
          >
            <Text style={styles.forgotPasswordButtonText}>重發驗證碼</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.forgotPasswordButtonText}>返回</Text>
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
