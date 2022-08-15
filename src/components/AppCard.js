import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { SignUpMethod } from "../models";
import colors from "../theme/colors";
import AppButton from "./AppButton";
import * as WebBrowser from "expo-web-browser";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ImageView from "react-native-image-viewing";

const dimensions = Dimensions.get("window");
const imageWidth = dimensions.width * 0.85;
const imageHeight = (imageWidth * 3) / 4;

export default function AppCard({ item, user }) {
  const { title, description, images, signUpMethod, page, formLink } = item;
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const onPressRegister = async () => {
    if (!user) {
      Alert.alert("請先登入", "", [
        {
          text: "取消",
          onPress: () => {},
        },
        {
          text: "前往登入",
          onPress: () => navigation.navigate("SignIn"),
          // style: "cancel",
        },
      ]);
      return;
    }
    switch (signUpMethod) {
      case SignUpMethod.APP_FORM:
        navigation.navigate("HearingCareForm", { event: item, user: user });
        break;
      case SignUpMethod.CALENDAR:
        navigation.navigate("CalendarInfoForm", { event: item, user: user });
        break;
      case SignUpMethod.GOOGLE_FORM:
        // Linking.openURL(formLink);
        try {
          await WebBrowser.openBrowserAsync(formLink);
        } catch (err) {
          Alert.alert("錯誤");
          console.log(err);
        }
    }
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => setIsVisible(true)}>
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.image}
        />
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ overflow: "hidden", borderRadius: 25 }}>
        <View>
          <Carousel
            layout={"default"}
            // ref={ref => this.carousel = ref}
            data={images}
            sliderWidth={imageWidth}
            itemWidth={imageWidth}
            // layoutCardOffset={`100`}
            inactiveSlideOpacity={0}
            inactiveSlideScale={1}
            renderItem={renderItem}
            onSnapToItem={setActiveIndex}
            firstItem={activeIndex}
          />
          <Pagination
            activeDotIndex={activeIndex}
            dotsLength={images.length}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: "#fff",
            }}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          />
        </View>
        <ImageView
          images={images}
          imageIndex={activeIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          onImageIndexChange={setActiveIndex}
          FooterComponent={({ imageIndex }) => {
            return (
              <Pagination
                activeDotIndex={imageIndex}
                dotsLength={images.length}
                dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  backgroundColor: "#fff",
                }}
                // inactiveDotStyle={{
                //   width: 10,
                //   height: 10,
                //   borderRadius: 5,
                //   marginHorizontal: 0,
                //   backgroundColor: "rgba(255, 255, 255, 0.8)",
                // }}
              />
            );
          }}
        />

        <View style={styles.footerContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {description}
          </Text>
          <AppButton
            title="我要報名"
            onPress={onPressRegister}
            style={{ marginVertical: 10 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 20,
    // justifyContent: "center",
    // alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 7,
    width: "85%",
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  description: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "400",
    marginTop: 10,
    marginBottom: 5,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  footerContainer: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
});
