import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";
import MapView, { Marker } from "react-native-maps";
import AppButton from "../components/AppButton";
import {
  Entypo,
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

export default Contact = () => {
  const openMap = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const lat = 25.05250921846677;
    const lng = 121.52005896971527;
    const latLng = `${lat},${lng}`;
    const label = "重聽福利協會";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={{ backgroundColor: colors.background, height: "100%" }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 20 }}
      >
        <View
          style={{
            borderRadius: 15,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.18,
            shadowRadius: 4.59,
            elevation: 5,
            backgroundColor: colors.background,
            marginBottom: 20,
          }}
        >
          <MapView
            initialRegion={{
              latitude: 25.05250921846677,
              longitude: 121.52005896971527,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={{
              width: Dimensions.get("window").width - 40,
              height: 200,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          >
            <Marker
              coordinate={{
                latitude: 25.05250921846677,
                longitude: 121.52005896971527,
              }}
              //title={"重聽福利協會"}
            />
          </MapView>
          <View style={{ padding: 15 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Entypo name="location-pin" size={20} color="black" />
              <Text style={{}}>103台北市大同區南京西路22號6樓</Text>
            </View>
            <AppButton title="使用地圖開啟" onPress={openMap}></AppButton>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <AppButton
            leftIcon={
              <AntDesign
                name="phone"
                size={20}
                color="#FFF"
                style={{ marginRight: 5 }}
              />
            }
            title="0800-731-580"
            onPress={() => {
              Linking.openURL(`tel:0800731580`);
            }}
            style={{
              width: "49%",
              height: 60,
              marginRight: "2%",
              justifyContent: "flex-start",
              paddingLeft: 15,
            }}
          />
          <AppButton
            leftIcon={
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#FFF"
                style={{ marginRight: 5 }}
              />
            }
            title="tw.hearhard"
            onPress={() => {
              Linking.openURL(`mailto:tw.hearhard@gmail.com`);
            }}
            style={{
              width: "49%",
              height: 60,
              justifyContent: "flex-start",
              paddingLeft: 15,
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <AppButton
            leftIcon={
              <Image
                source={require("../images/line.png")}
                style={{ width: 22, height: 22, marginRight: 5 }}
              />
            }
            title="hearhard"
            onPress={() => {
              Linking.openURL(`tel:0800731580`);
            }}
            style={{
              width: "49%",
              height: 60,
              marginRight: "2%",
              justifyContent: "flex-start",
              paddingLeft: 15,
            }}
          />
          <AppButton
            leftIcon={
              <Feather
                name="facebook"
                size={20}
                color="#FFF"
                style={{ marginRight: 5 }}
              />
            }
            title="粉絲專頁"
            onPress={() => {
              Linking.openURL(`https://www.facebook.com/TWhearhard`);
            }}
            style={{
              width: "49%",
              height: 60,
              justifyContent: "flex-start",
              paddingLeft: 15,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
