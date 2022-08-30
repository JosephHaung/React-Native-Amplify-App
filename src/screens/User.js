import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import AppButton from "../components/AppButton";
import { Auth, SortDirection } from "aws-amplify";
import { Registration, SignUpMethod } from "../models";
import { DataStore } from "aws-amplify";
import { Feather, Entypo } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as WebBrowser from "expo-web-browser";
import moment from "moment-timezone";

const ITEM_WIDTH = Dimensions.get("window").width * 0.85;
const SERVICES = [
  { id: 0, name: "聽力保健講座 (1小時，人數不限)" },
  { id: 1, name: "聽力篩檢 (2小時，35人以內)" },
  { id: 2, name: "聽損者聽力照護服務 (2小時，人數不限)" },
];

export default User = ({ route }) => {
  const navigation = useNavigation();
  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate("Home");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  const { user } = route.params;
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(async () => {
    if (!user) return;
    try {
      const events = await DataStore.query(
        Registration,
        (reg) => reg.email("eq", user.attributes.email),
        {
          sort: (reg) => reg.createdAt(SortDirection.DESCENDING),
        }
      );
      setRegisteredEvents(events);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.sectionTop}>
            <Text style={styles.topBarText}>
              您好{user.attributes.name && `，${user.attributes.name}`}
            </Text>
            <AppButton title="登出" onPress={() => signOut()} />
          </View>
          <View style={{ width: "100%", flexGrow: 1 }}>
            {registeredEvents.length != 0 ? (
              <>
                <Text
                  style={{
                    color: "#000",
                    fontSize: 20,
                    fontWeight: "700",
                    // marginLeft: "12%",
                    marginTop: 20,
                    marginBottom: 20,
                    alignSelf: "center",
                  }}
                >
                  <Entypo name="flag" size={20} color="black" /> 報名紀錄
                </Text>
                <FlatList
                  data={registeredEvents}
                  // Render Items
                  renderItem={({ item }) => (
                    <Item
                      item={item}
                      setOpen={setOpen}
                      setContent={setContent}
                    />
                  )}
                  keyExtractor={(item, index) => String(index)}
                  style={{ width: "100%", flex: 1 }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 30,
                  }}
                  // ListHeaderComponent={this.renderHeader}
                  // // Footer (Activity Indicator)
                  // ListFooterComponent={this.renderFooter}
                  // // On End Reached (Takes a function)
                  // onEndReached={this.retrieveMore}
                  // // How Close To The End Of List Until Next Data Request Is Made
                  // onEndReachedThreshold={0}
                  // // Refreshing (Set To True When End Reached)
                  // refreshing={this.state.refreshing}
                />
              </>
            ) : (
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "400",
                  fontSize: 16,
                  marginTop: 15,
                }}
              >
                暫無報名紀錄
              </Text>
            )}
          </View>
          <Modal isVisible={open} onBackdropPress={() => setOpen(false)}>
            <View style={styles.modalContainer}>{content}</View>
          </Modal>
        </>
      ) : (
        <AppButton
          title="請先登入"
          onPress={() => navigation.navigate("SignIn")}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

const Item = ({ item, setOpen, setContent }) => {
  const onPressMenu = () => {
    setOpen(true);
    let content = null;
    if (item.event?.signUpMethod === SignUpMethod.CALENDAR) {
      const { data } = item;
      content = (
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={styles.keyText}>個案姓名</Text>
          <Text style={styles.valueText}>{data.name}</Text>
          <Text style={styles.keyText}>出生年月日</Text>
          <Text style={styles.valueText}>{data.birthDate}</Text>
          <Text style={styles.keyText}>聯絡人姓名</Text>
          <Text style={styles.valueText}>{data.contactName}</Text>
          <Text style={styles.keyText}>與身障者關係</Text>
          <Text style={styles.valueText}>{data.relationship}</Text>
          <Text style={styles.keyText}>聯絡電話</Text>
          <Text style={styles.valueText}>{data.phoneNumber}</Text>
          <Text style={styles.keyText}>Line ID</Text>
          <Text style={styles.valueText}>{data.lineId}</Text>
        </View>
      );
    } else if (item.event?.signUpMethod === SignUpMethod.APP_FORM) {
      const { data } = item;
      let services = "";
      for (let id of data.services) {
        services += SERVICES[id].name;
        services += " ";
      }
      content = (
        <View style={{ alignItems: "center", marginHorizontal: 20 }}>
          <Text style={styles.keyText}>機構或單位名稱</Text>
          <Text style={styles.valueText}>{data.orgName}</Text>
          <Text style={styles.keyText}>承辦人姓名、職稱</Text>
          <Text style={styles.valueText}>{data.agentName}</Text>
          <Text style={styles.keyText}>聯絡電話</Text>
          <Text style={styles.valueText}>{data.phoneNumber}</Text>
          <Text style={styles.keyText}>聯絡Email</Text>
          <Text style={styles.valueText}>{data.email}</Text>
          <Text style={styles.keyText}>服務需求</Text>
          <Text style={styles.valueText}>{services}</Text>
          <Text style={styles.keyText}>預計辦理時程（志願一）</Text>
          <Text style={styles.valueText}>
            {moment(data.date1).tz("Asia/Taipei").format("YYYY/MM/DD")}
            {data.apm1 === "am" ? "上午" : "下午"}
          </Text>
          <Text style={styles.keyText}>預計辦理時程（志願二）</Text>
          <Text style={styles.valueText}>
            {moment(data.date2).tz("Asia/Taipei").format("YYYY/MM/DD")}
            {data.apm2 === "am" ? "上午" : "下午"}
          </Text>
          <Text style={styles.keyText}>預計辦理時程（志願三）</Text>
          <Text style={styles.valueText}>
            {moment(data.date3).tz("Asia/Taipei").format("YYYY/MM/DD")}
            {data.apm3 === "am" ? "上午" : "下午"}
          </Text>
        </View>
      );
    } else {
      content = (
        <View>
          <Text>此活動透過 Google 表單填寫</Text>
          <Text onPress={onPressLink}>點擊查看</Text>
        </View>
      );
    }
    setContent(content);
  };
  const onPressLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(formLink);
    } catch (err) {
      Alert.alert("連結已失效，請聯絡協會");
      console.log(err);
    }
  };
  return (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: "column" }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
          {item.event?.title}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.itemDescription}
        >
          報名日期：{item.event?.createdAt?.substring(0, 10)}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={onPressMenu}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    flex: 1,
    backgroundColor: colors.background,
    height: "100%",
  },
  sectionTop: {
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    marginTop: 30,
    marginBottom: 20,
    width: "85%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sectionBottom: {
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    paddingVertical: 20,
    backgroundColor: colors.background,
    marginBottom: 20,
    width: "85%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    display: "flex",
  },
  topBarContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  topBarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1C16",
  },
  itemContainer: {
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 7,
    width: ITEM_WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.background,
  },
  itemTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  itemDescription: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  modalContainer: {
    //height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: "20%",
    paddingVertical: 20,
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
  },
  keyText: {
    fontSize: 16,
    fontWeight: "700",
  },
  valueText: {
    marginTop: 5,
    marginBottom: 20,
    fontWeight: "400",
    textAlign: "center",
  },
});
