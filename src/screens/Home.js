import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppCard from "../components/AppCard";
import { News } from "../models";
import { DataStore, Auth, Hub } from "aws-amplify";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { S3Image } from "aws-amplify-react-native";

export default Home = () => {
  useEffect(() => {
    const listener = (data) => {
      const { event } = data.payload;
      console.log(event);
      if (event === "SUCCESS" || event === "signIn" || event === "signOut") {
        checkAuthState();
      }
    };
    Hub.listen("auth", listener);
    return () => Hub.remove("auth", listener);
  }, []);
  useEffect(() => {
    checkAuthState();
  }, []);
  const [user, setUser] = useState(undefined);

  const checkAuthState = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      console.log("Home: User is signed in: " + authUser);
      setUser(authUser);
    } catch (err) {
      console.log("User is not signed in");
      setUser(null);
    }
  };
  const navigation = useNavigation();
  async function signOut() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  console.log(user);

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <AppButton title="SignOut" onPress={() => signOut()} />
      ) : (
        <AppButton
          title="SignIn"
          onPress={() => navigation.navigate("SignIn")}
        />
      )}
      <AppButton title="Rehab" onPress={() => navigation.navigate("Rehab")} />
      <AppButton
        title="JobPromotion"
        onPress={() => navigation.navigate("JobPromotion")}
      />
      <AppButton
        title="HearingAssessment"
        onPress={() => navigation.navigate("Rehab")}
      />
      <AppButton
        title="HearingCare"
        onPress={() => navigation.navigate("HearingCare")}
      />
      <AppButton
        title="HearingTry"
        onPress={() => navigation.navigate("HearingTry")}
      />
      <AppButton
        title="Contact"
        onPress={() => navigation.navigate("Contact")}
      />
      <AppButton title="Form" onPress={() => navigation.navigate("AppForm")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 10,
  },
});
