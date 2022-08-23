import React, { useState, useEffect } from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignInScreen from "../screens/Auth/SignIn";
import SignUpScreen from "../screens/Auth/SignUp";
import ResetPasswordScreen from "../screens/Auth/ResetPassword";
import HomeScreen from "../screens/Home";
import { Auth, Hub } from "aws-amplify";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmSignUpScreen from "../screens/Auth/ConfirmSignUp";
import ProfileScreen from "../screens/Profile/Profile.js";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword.js";
import AppForm from "../forms/HearingCareForm.js";
import CalendarForm from "../forms/CalendarForm";
import HearingCareForm from "../forms/HearingCareForm";
import CalendarInfoForm from "../forms/CalendarInfoForm";
import ContactScreen from "../screens/Contact";
import AppDetailPageScreen from "../screens/AppDetailPage";
import UserScreen from "../screens/User.js";
import pageNames from "../pageName.js";
import colors from "../theme/colors";

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const ProfileScreenNavigation = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="ProfileIndex" component={ProfileScreen} />
//       <Stack.Screen name="SignIn" component={SignInScreen} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} />
//       <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//     </Stack.Navigator>
//   );
// };

const Navigation = () => {
  // const [user, setUser] = useState(undefined);

  // useEffect(() => {
  //   checkAuthState();
  // }, []);

  // useEffect(() => {
  //   const listener = (data) => {
  //     const { event } = data.payload;
  //     // console.log(event);
  //     if (event === "SUCCESS" || event === "signOut") {
  //       checkAuthState();
  //     }
  //   };
  //   Hub.listen("auth", listener);
  //   return () => Hub.remove("auth", listener);
  // }, []);

  // const checkAuthState = async () => {
  //   try {
  //     const authUser = await Auth.currentAuthenticatedUser({
  //       bypassCache: true,
  //     });
  //     console.log("User is signed in: " + user);
  //     setUser(authUser);
  //   } catch (err) {
  //     console.log("User is not signed in");
  //     setUser(null);
  //   }
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: "#000",
          //  tabBarActiveTintColor: MyTheme.colors.primary,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false, title: "首頁" }}
          // options={{
          //   tabBarLabel: "首頁",
          //   tabBarIcon: ({ color, size }) => (
          //     <MaterialCommunityIcons name="home" color={color} size={size} />
          //   ),
          // }}
        />
        <Stack.Screen
          name="AppDetailPage"
          component={AppDetailPageScreen}
          options={({ route }) => ({
            headerTitle: pageNames[route.params?.pageName],
            headerBackTitle: "首頁",
          })}
        />

        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: pageNames["CONTACT"], headerBackTitle: "首頁" }}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={{ title: "個人資料", headerBackTitle: "首頁" }}
        />

        {/* Forms */}
        <Stack.Screen
          name="CalendarForm"
          component={CalendarForm}
          options={{ title: "選擇日期" }}
        />
        <Stack.Screen
          name="CalendarInfoForm"
          component={CalendarInfoForm}
          options={({ route }) => {
            return { headerTitle: route.params?.event.title };
          }}
        />
        <Stack.Screen
          name="HearingCareForm"
          component={HearingCareForm}
          options={({ route }) => {
            return { headerTitle: route.params?.event.title };
          }}
        />

        {/* Auth Stack */}
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmSignUp"
          component={ConfirmSignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
