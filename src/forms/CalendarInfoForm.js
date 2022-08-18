import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import colors from "../theme/colors";
import { API } from "aws-amplify";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import { useNavigation } from "@react-navigation/native";

export default function AppForm({ route }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      birthDate: "",
      contactName: "",
      relationship: "",
      phoneNumber: "",
      lineId: "",
    },
  });

  const [status, setStatus] = useState(0);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { user, event } = route.params;

  const onSubmit = async (data) => {
    navigation.navigate("CalendarForm", {
      formData: data,
      user: user,
      event: event,
    });
  };

  const getFormattedData = () => {
    const data = getValues();
    let services = "";
    for (let id of data.services) {
      services += SERVICES[id].name;
      services += " ";
    }
    const formatted = `
機構或單位名稱：${data.orgName}
承辦人姓名、職稱：${data.agentName}
聯絡電話：${data.phoneNumber}
聯絡Email：${data.email}
服務需求：${services}
預計辦理時程（志願一）：${data.date1.toISOString().substring(0, 10)} ${
      data.apm1 === "am" ? "上午" : "下午"
    }
預計辦理時程（志願二）：${data.date2.toISOString().substring(0, 10)} ${
      data.apm2 === "am" ? "上午" : "下午"
    }
預計辦理時程（志願三）：${data.date3.toISOString().substring(0, 10)} ${
      data.apm3 === "am" ? "上午" : "下午"
    }
    `;
    return formatted;
  };

  const onPressLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://tpap.taipei/app37/cognitionView/taipeicentercategory"
      );
    } catch (err) {
      Alert.alert("錯誤");
      console.log(err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        display: "flex",
        flex: 1,
        height: "100%",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>基本資料</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="個案姓名"
              />
            )}
            name="name"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="出生年月日"
              />
            )}
            name="birthDate"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="聯絡人姓名"
              />
            )}
            name="contactName"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="與身障者關係"
              />
            )}
            name="relationship"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="聯絡電話"
              />
            )}
            name="phoneNumber"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Line ID"
              />
            )}
            name="lineId"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>評估9號報告書</Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 24,
            }}
          >
            必須先向輔具中心登記，
            <Text
              onPress={onPressLink}
              style={{ textDecorationLine: "underline" }}
            >
              所屬輔具中心查詢
            </Text>
            {"\n"}
            1. 身分證(若無身分證請攜帶戶口名簿){"\n"}
            2. 身障手冊{"\n"}
            3. 印章（無法簽名者請攜帶）
          </Text>
        </View>
      </ScrollView>
      <View style={{ padding: 20, backgroundColor: colors.background }}>
        <AppButton
          title="提交"
          onPress={handleSubmit(onSubmit)}
          // style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
    // marginLeft: 15,
  },
  section: {
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    padding: 20,
    backgroundColor: colors.background,
    marginBottom: 20,
  },
});
