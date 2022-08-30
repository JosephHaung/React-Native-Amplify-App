import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import Navigation from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
Amplify.configure(awsconfig);

function App() {
  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Navigation />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
