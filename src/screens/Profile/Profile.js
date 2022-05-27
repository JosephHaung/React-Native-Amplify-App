import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppListButton from "../../components/AppListButton";
import { useNavigation } from "@react-navigation/native";
import { Auth, Hub } from "aws-amplify";

export default Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(undefined);
  const CONFIG = [
    {
      title: "登入",
      name: "SignIn",
      onPress: () => navigation.navigate("SignIn"),
    },
    {
      title: "匯款資訊",
      name: "TransferInfo",
      onPress: () => navigation.navigate("TransferInfo"),
    },
    { title: "登出", name: "SignOut", onPress: () => signOut() },
  ];

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate("ProfileIndex");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  useEffect(() => {
    const listener = (data) => {
      const { event } = data.payload;
      // console.log(event);
      if (event === "SUCCESS" || event === "signOut") {
        checkAuthState();
      }
    };
    Hub.listen("auth", listener);
    return () => Hub.remove("auth", listener);
  }, []);
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      console.log("User is signed in: " + user);
      setUser(authUser);
    } catch (err) {
      console.log("User is not signed in");
      setUser(null);
    }
  };
  return (
    <SafeAreaView>
      {CONFIG.map((item) => {
        if (item.name === "SignIn" && user) {
          return null;
        }
        if (item.name === "SignOut" && !user) {
          return null;
        }
        return <AppListButton title={item.title} onPress={item.onPress} />;
      })}
    </SafeAreaView>
  );
};
