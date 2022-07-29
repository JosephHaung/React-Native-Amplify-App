import React, { useState } from "react";
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
import colors from "../../theme/colors";

export default ConfirmSignUp = ({ route }) => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const confirmSignUp = async () => {
    try {
      const user = await Auth.confirmSignUp(route.params.username, code);
      await Auth.signIn(route.params.username, route.params.password);
      console.log(user);
      navigation.navigate("Home");
    } catch (error) {
      console.log("error signing up", error);
      setErrorMessage("驗證失敗");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "600",
            marginBottom: 5,
            textAlign: "left",
            width: "85%",
          }}
        >
          驗證帳號
        </Text>
        <AppTextInput
          value={code}
          onChangeText={(code) => {
            setCode(code);
            setErrorMessage(null);
          }}
          placeholder="六位數驗證碼"
          autoCapitalize="none"
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          leftIcon="account"
        />
        {errorMessage && (
          <Text style={{ fontSize: 14, color: "red", marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}
        <AppButton
          title="確認"
          onPress={confirmSignUp}
          style={{ marginTop: 10, width: "85%" }}
        />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity
            onPress={() => Auth.resendSignUp(route.params.username)}
          >
            <Text style={styles.forgotPasswordButtonText}>重發驗證碼</Text>
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
