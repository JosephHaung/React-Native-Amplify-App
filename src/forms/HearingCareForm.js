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
import { getTokenAndSubmitToSheets } from "../functions";
import colors from "../theme/colors";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { API } from "aws-amplify";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import * as mutations from "../graphql/mutations";

const SERVICES = [
  { id: 0, name: "聽力保健講座 (1小時，人數不限)" },
  { id: 1, name: "聽力篩檢 (2小時，35人以內)" },
  { id: 2, name: "聽損者聽力照護服務 (2小時，人數不限)" },
];

export default function HearingCareForm({ route }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      orgName: "",
      agentName: "",
      email: "",
      phoneNumber: "",
      services: [],
      date1: new Date(),
      date2: new Date(),
      date3: new Date(),
      apm1: "am",
      apm2: "am",
      apm3: "am",
    },
  });

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [status, setStatus] = useState(0);
  const [open, setOpen] = useState(false);

  const onSubmit = async (data) => {
    const apiName = "sendEmail";
    const path = "/email";
    const res = await API.post(apiName, path, {
      body: {
        subject: "報名",
        text: getFormattedData(),
      },
      userEmail: route.params.user.attributes.email,
    });

    const res2 = await API.graphql({
      query: mutations.createRegistration,
      variables: {
        input: {
          data: JSON.stringify(data),
          registrationEventId: route.params.event.id,
          email: route.params.user.attributes.email,
        },
      },
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

  const handleCheck = (checkedId) => {
    const { services } = getValues();
    const isOriginallyChecked = services.includes(checkedId);
    let newIds = [];
    if (isOriginallyChecked) {
      newIds = services.filter((id) => id !== checkedId);
    } else {
      newIds = [...services, checkedId];
    }
    return newIds;
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
                placeholder="機構或單位名稱"
              />
            )}
            name="orgName"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="承辦人姓名、職稱"
              />
            )}
            name="agentName"
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
                placeholder="聯絡Email"
              />
            )}
            name="email"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>服務需求 (可複選)</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) =>
              SERVICES.map((service) => (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    value={value.includes(service.id)}
                    onValueChange={() => {
                      const newIds = handleCheck(service.id);
                      onChange(newIds);
                    }}
                    color={colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      marginLeft: 10,
                      color: colors.primary,
                    }}
                  >
                    {service.name}
                  </Text>
                </View>
              ))
            }
            name="services"
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitleText, { marginBottom: 20 }]}>
            預計辦理時程 (實際日期待聯繫確認)
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: "500",
                marginRight: 10,
              }}
            >
              第一志願
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateTimePicker
                  value={value}
                  onChange={(event, selectedDate) => onChange(selectedDate)}
                  locale="zh-Hant"
                  mode="date"
                  style={{
                    minWidth: 100,
                  }}
                  display="compact"
                />
              )}
              name="date1"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropDownPicker
                  open={open1}
                  value={value}
                  dropDownDirection="TOP"
                  items={[
                    { label: "上午", value: "am" },
                    { label: "下午", value: "pm" },
                  ]}
                  setValue={onChange}
                  setOpen={setOpen1}
                  style={{
                    marginLeft: 15,
                    width: 100,
                    minHeight: 35,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                  }}
                  dropDownContainerStyle={{
                    width: 100,
                    marginLeft: 15,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                    borderBottomWidth: 1,
                  }}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                />
              )}
              name="apm1"
            />
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: "500",
                marginRight: 10,
              }}
            >
              第二志願
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateTimePicker
                  value={value}
                  onChange={(event, selectedDate) => onChange(selectedDate)}
                  locale="zh-Hant"
                  mode="date"
                  style={{
                    minWidth: 100,
                  }}
                  display="compact"
                />
              )}
              name="date2"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropDownPicker
                  open={open2}
                  value={value}
                  dropDownDirection="TOP"
                  items={[
                    { label: "上午", value: "am" },
                    { label: "下午", value: "pm" },
                  ]}
                  setValue={onChange}
                  setOpen={setOpen2}
                  style={{
                    marginLeft: 15,
                    width: 100,
                    minHeight: 35,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                  }}
                  dropDownContainerStyle={{
                    width: 100,
                    marginLeft: 15,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                    borderBottomWidth: 1,
                  }}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                />
              )}
              name="apm2"
            />
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                fontWeight: "500",
                marginRight: 10,
              }}
            >
              第三志願
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateTimePicker
                  value={value}
                  onChange={(event, selectedDate) => onChange(selectedDate)}
                  locale="zh-Hant"
                  mode="date"
                  style={{
                    minWidth: 100,
                  }}
                  display="compact"
                />
              )}
              name="date3"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropDownPicker
                  open={open3}
                  value={value}
                  dropDownDirection="TOP"
                  items={[
                    { label: "上午", value: "am" },
                    { label: "下午", value: "pm" },
                  ]}
                  setValue={onChange}
                  setOpen={setOpen3}
                  style={{
                    marginLeft: 15,
                    width: 100,
                    minHeight: 35,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                  }}
                  dropDownContainerStyle={{
                    width: 100,
                    marginLeft: 15,
                    borderWidth: 0,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                    borderBottomWidth: 1,
                  }}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                />
              )}
              name="apm3"
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20, backgroundColor: colors.background }}>
        <AppButton
          title="提交"
          onPress={handleSubmit(() => setOpen(true))}
          // style={{ marginTop: 10 }}
        />
        <AppModal
          open={open}
          setOpen={setOpen}
          status={status}
          setStatus={setStatus}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 15 }}>
            請確認提交內容
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              textAlign: "left",
              alignSelf: "flex-start",
              //width: "100%",
              marginLeft: 50,
              lineHeight: 25,
            }}
          >
            {getFormattedData()}
          </Text>
        </AppModal>
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
