import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../theme/colors";
import { AntDesign } from "@expo/vector-icons";

export default function SignIn({ route }) {
  const [email, setEmail] = useState(route?.params?.username);
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(null);
  const passwordInput = useRef();

  const signIn = async () => {
    try {
      const user = await Auth.signIn(email, password);
      navigation.navigate("Home");
    } catch (error) {
      if (error.code === "UserNotConfirmedException") {
        await Auth.resendSignUp(email);
        navigation.navigate("ConfirmSignUp", {
          username: email,
          password: password,
        });
        return;
      }
      console.log("error signing in", error);
      setErrorMessage("帳號或密碼錯誤");
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
              // textAlign: "left",
              // width: "85%",
            }}
          >
            重聽福利協會
          </Text>

          <AppButton
            leftIcon={<AntDesign name="back" size={20} color={"#000"} />}
            onPress={() => navigation.goBack()}
            bgColor={colors.background}
            style={{ shadowColor: "#000", shadowOpacity: 0.15 }}
            // textColor="#fff"
            // style={{ width: "85%", marginTop: 20 }}
          />
        </View>

        <AppTextInput
          value={email}
          onChangeText={(e) => {
            setEmail(e);
            setErrorMessage(null);
          }}
          placeholder={"Email"}
          autoCapitalize="none"
          textContentType="emailAddress"
          leftIcon={"email-outline"}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordInput.current.focus();
          }}
          blurOnSubmit={false}
        />
        <AppTextInput
          value={password}
          onChangeText={(e) => {
            setPassword(e);
            setErrorMessage(null);
          }}
          placeholder={"密碼"}
          autoCapitalize="none"
          secureTextEntry={true}
          textContentType="password"
          leftIcon={"lock"}
          ref={passwordInput}
        />
        {errorMessage && (
          <Text style={{ fontSize: 14, color: "red", marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
        <AppButton
          title="登入"
          onPress={signIn}
          style={{ marginTop: 10, width: "85%" }}
        />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.forgotPasswordButtonText}>沒有帳號？註冊</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordButtonText}>忘記密碼</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: colors.background,
  },
  footerButtonContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
