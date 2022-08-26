import React, { useState, useRef } from "react";
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
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { API } from "aws-amplify";
import AppButton from "../components/AppButton";
import AppModal from "../components/AppModal";
import * as mutations from "../graphql/mutations";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const agentNameInput = useRef();
  const phoneNumberInput = useRef();
  const emailInput = useRef();

  const onSubmit = async (data) => {
    const apiName = "sendEmail";
    const path = "/email";
    const res = await API.post(apiName, path, {
      body: {
        subject: "報名",
        text: getFormattedData()[1],
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
    const formattedReact = (
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
          {data.date1.toISOString().substring(0, 10)}
          {data.apm1 === "am" ? "上午" : "下午"}
        </Text>
        <Text style={styles.keyText}>預計辦理時程（志願二）</Text>
        <Text style={styles.valueText}>
          {data.date2.toISOString().substring(0, 10)}
          {data.apm2 === "am" ? "上午" : "下午"}
        </Text>
        <Text style={styles.keyText}>預計辦理時程（志願三）</Text>
        <Text style={styles.valueText}>
          {data.date3.toISOString().substring(0, 10)}
          {data.apm3 === "am" ? "上午" : "下午"}
        </Text>
      </View>
    );
    const formattedHTML = `
您已成功報名${route.params.event.name}，以下為提交內容：

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

若有疑問，請回覆此郵件。
    `;
    return [formattedReact, formattedHTML];
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
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="機構或單位名稱"
                returnKeyType="next"
                onSubmitEditing={() => agentNameInput.current.focus()}
                blurOnSubmit={false}
              />
            )}
            name="orgName"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                ref={agentNameInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="承辦人姓名、職稱"
                returnKeyType="next"
                onSubmitEditing={() => phoneNumberInput.current.focus()}
                blurOnSubmit={false}
              />
            )}
            name="agentName"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                ref={phoneNumberInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="聯絡電話"
                returnKeyType="next"
                onSubmitEditing={() => emailInput.current.focus()}
                blurOnSubmit={false}
              />
            )}
            name="phoneNumber"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                ref={emailInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="聯絡Email"
                returnKeyType="next"
              />
            )}
            name="email"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>服務需求 (可複選)</Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
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
                      fontSize: 16,
                      marginLeft: 10,
                      color: "#000",
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
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 20,
          paddingHorizontal: 20,
          backgroundColor: colors.background,
        }}
      >
        {Object.keys(errors).length !== 0 && (
          <Text style={styles.errorText}>所有欄位皆為必填</Text>
        )}
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
          <View
            style={{
              flexDirection: "row",
              marginBottom: 30,
              borderBottomWidth: 1.5,
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={25}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontWeight: "700", fontSize: 20 }}>
              請確認資料正確無誤
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              // textAlign: "left",
              // alignSelf: "flex-start",
              //width: "100%",
              lineHeight: 25,
            }}
          >
            {getFormattedData()[0]}
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
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 15,
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
