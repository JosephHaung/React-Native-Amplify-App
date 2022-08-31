import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { News } from "../models";
import { DataStore, Auth, Hub } from "aws-amplify";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import { S3Image } from "aws-amplify-react-native";
import colors from "../theme/colors";
import pageNames from "../pageName";
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  Ionicons,
  Feather,
} from "@expo/vector-icons";

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

  const PAGES = [
    {
      name: "REHAB",
      icon: <AntDesign name="tool" size={30} color={colors.secondary} />,
      bgColor: colors.primary,
      textColor: colors.secondary,
    },
    {
      name: "JOB_PROMOTION",
      icon: <AntDesign name="notification" size={30} color={colors.primary} />,
      bgColor: colors.secondary,
      textColor: colors.primary,
    },
    {
      name: "HEARING_CARE",
      icon: <AntDesign name="team" size={30} color={colors.primary} />,
      bgColor: colors.secondary,
      textColor: colors.primary,
    },
    {
      name: "HEARING_ASSESSMENT",
      icon: <AntDesign name="form" size={30} color={colors.secondary} />,
      bgColor: colors.primary,
      textColor: colors.secondary,
    },
    {
      name: "HEARING_TRY",
      icon: (
        <AntDesign name="customerservice" size={30} color={colors.secondary} />
      ),
      bgColor: colors.primary,
      textColor: colors.secondary,
    },
    {
      name: "CONTACT",
      icon: <AntDesign name="phone" size={30} color={colors.primary} />,
      bgColor: colors.secondary,
      textColor: colors.primary,
    },
  ];

  return (
    <View style={styles.container}>
      {/* <View style={styles.topBarContainer}>

      {user ? (
        <AppButton title="SignOut" onPress={() => signOut()} />
      ) : (
        <AppButton
          title="SignIn"
          onPress={() => navigation.navigate("SignIn")}
        />
      )}
      </View> */}
      <View style={styles.topBarContainer}>
        <Text style={styles.topBarText}>重聽福利協會</Text>
        <AppButton
          leftIcon={<Feather name="user" size={30} color="black" />}
          title=""
          bgColor={colors.background}
          onPress={() => navigation.navigate("User", { user })}
          style={{
            borderRadius: 30,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            // borderWidth: 2,
          }}
        />
      </View>
      {PAGES.map((page) => (
        <AppTile
          title={pageNames[page.name]}
          onPress={() =>
            page.name === "CONTACT"
              ? navigation.navigate("Contact")
              : navigation.navigate("AppDetailPage", {
                  user,
                  pageName: page.name,
                })
          }
          icon={page.icon}
          bgColor={page.bgColor}
          textColor={page.textColor}
          key={page.name}
        />
      ))}
    </View>
  );
};

const AppTile = ({ icon, onPress, title, bgColor, textColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tileContainer, { backgroundColor: bgColor }]}
    >
      {icon}
      <Text style={[styles.tileText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const TILE_SIZE = Dimensions.get("window").width * 0.4;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.background,
    alignContent: "center",
  },
  tileContainer: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.59,
    elevation: 5,
    marginHorizontal: "3%",
    marginVertical: "3%",
  },
  tileText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 15,
  },
  topBarContainer: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 80,
  },
  topBarText: {
    fontSize: 30,
    fontWeight: "700",
  },
});
