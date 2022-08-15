import React, { useStat, useRef } from "react";
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

export default SignIn = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(null);

  const forgotPassword = async () => {
    try {
      const data = await Auth.forgotPassword(email);
      console.log(data);
      //   console.log(user);
      navigation.navigate("ResetPassword", { username: email });
    } catch (error) {
      console.log("error signing up", error);
      setErrorMessage("發送失敗，請稍後再試");
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
          忘記密碼
        </Text>
        <AppTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="輸入Email"
          autoCapitalize="none"
          textContentType="username"
          leftIcon="account"
        />
        {errorMessage && (
          <Text style={{ fontSize: 14, color: "red", marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
        <AppButton
          title="確認"
          onPress={forgotPassword}
          style={{ marginTop: 10, width: "85%" }}
        />
        <View style={styles.footerButtonContainer}>
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
