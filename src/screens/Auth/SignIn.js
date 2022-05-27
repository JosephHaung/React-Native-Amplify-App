import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Auth } from "aws-amplify";
import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [opacity, setOpacity] = useState(0);

  const signIn = async () => {
    try {
      const user = await Auth.signIn(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.log("error signing in", error);
      setOpacity(1);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 16, color: "red", opacity: opacity }}>
        帳號或密碼錯誤
      </Text>
      <AppTextInput
        value={email}
        onChangeText={(e) => {
          setEmail(e);
          setOpacity(0);
        }}
        placeholder={"輸入 Email"}
        autoCapitalize="none"
        textContentType="emailAddress"
        leftIcon={"account"}
      />
      <AppTextInput
        value={password}
        onChangeText={(e) => {
          setPassword(e);
          setOpacity(0);
        }}
        placeholder={"輸入密碼"}
        autoCapitalize="none"
        secureTextEntry={true}
        textContentType="password"
        leftIcon={"lock"}
      />
      <AppButton title="登入" onPress={signIn} />
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.forgotPasswordButtonText}>沒有帳號？註冊</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPasswordButtonText}>忘記密碼</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
