import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default About = () => {
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, alignSelf: "center" }}>About us...</Text>
    </SafeAreaView>
  );
};
