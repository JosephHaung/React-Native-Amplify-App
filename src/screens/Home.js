import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppCard from "../components/AppCard";
import { News } from "../models";
import { DataStore, Hub } from "aws-amplify";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

export default Home = () => {
  useEffect(() => {
    const listener = (data) => {
      const { event } = data.payload;
      // console.log(event);
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
      console.log("Home: User is signed in: " + user);
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
