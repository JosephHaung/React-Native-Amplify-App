import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignInScreen from "../screens/Auth/SignIn";
import SignUpScreen from "../screens/Auth/SignUp";
// import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from "../screens/Home";
import RehabScreen from "../screens/Rehab";
import JobPromotionScreen from "../screens/JobPromotion";
import HearingCareScreen from "../screens/HearingCare";
import HearingAssessmentScreen from "../screens/HearingAssessment";
import HearingTryScreen from "../screens/HearingTry";
import { Auth, Hub } from "aws-amplify";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmSignUpScreen from "../screens/Auth/ConfirmSignUp";
import ProfileScreen from "../screens/Profile/Profile.js";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword.js";
import AppForm from "../components/AppForm.js";

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
          //  tabBarActiveTintColor: MyTheme.colors.primary,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options={{
          //   tabBarLabel: "首頁",
          //   tabBarIcon: ({ color, size }) => (
          //     <MaterialCommunityIcons name="home" color={color} size={size} />
          //   ),
          // }}
        />
        <Stack.Screen name="Rehab" component={RehabScreen} />
        <Stack.Screen name="JobPromotion" component={JobPromotionScreen} />
        <Stack.Screen name="HearingCare" component={HearingCareScreen} />
        <Stack.Screen
          name="HearingAssessment"
          component={HearingAssessmentScreen}
        />
        <Stack.Screen name="HearingTry" component={HearingTryScreen} />
        <Stack.Screen name="AppForm" component={AppForm} />

        {/* Auth Stack */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
