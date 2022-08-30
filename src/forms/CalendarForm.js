import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import { getToken } from "../functions";
import { CALENDAR_ID, TIMETREE_CALENDAR_ID, TIMETREE_ACCESS_TOKEN } from "@env";
import AppButton from "../components/AppButton";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import colors from "../theme/colors";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import AppModal from "../components/AppModal";
import * as mutations from "../graphql/mutations";
import { API } from "aws-amplify";
import { MaterialCommunityIcons } from "@expo/vector-icons";

LocaleConfig.locales.zh = {
  monthNames: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  monthNamesShort: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  dayNames: ["日", "一", "二", "三", "四", "五", "六"],
  dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
};
LocaleConfig.defaultLocale = "zh";

export default function AppForm({ route }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    getUpComingEvents();
  }, []);

  const [availableEvents, setAvailableEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { user, event, formData } = route?.params;

  const getUpComingEvents = async () => {
    try {
      const token = await getToken();
      const now = new Date().toISOString();
      const twoWeeksLater = new Date();
      const encodedTitle = encodeURI(event.title);

      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?q=${encodedTitle}&timeMin=${now}&timeMax=${twoWeeksLater.toISOString()}&singleEvents=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            //update this token with yours.
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const events = await res.json();
      const formattedEvents = {};
      for (let e of events.items) {
        const startDate = e.start.dateTime.substring(0, 10);
        const title = `${e.start.dateTime.substring(
          11,
          16
        )} - ${e.end.dateTime.substring(11, 16)}`;
        const data = {
          title: title,
          summary: e.summary,
          id: e.id,
          start: e.start,
          end: e.end,
          date: startDate,
        };
        if (startDate in formattedEvents) {
          formattedEvents[startDate].push(data);
        } else {
          formattedEvents[startDate] = [data];
        }
      }
      console.log(formattedEvents);
      setAvailableEvents(formattedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const getMarkedDates = (items) => {
    const marked = {};
    for (let day in items) {
      marked[day] = { disabled: false };
    }
    return marked;
  };

  return (
    <View
      style={{ display: "flex", flex: 1, backgroundColor: colors.background }}
    >
      <CalendarList
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={0}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={3}
        // Enable or disable scrolling of calendar list
        scrollEnabled
        // Enable or disable vertical scroll indicator. Default = false
        horizontal
        pagingEnabled
        markedDates={getMarkedDates(availableEvents)}
        disableAllTouchEventsForDisabledDays
        disabledByDefault
        onDayPress={({ dateString }) => setSelectedDate(dateString)}
      />
      <View
        style={{
          marginHorizontal: 20,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          flex: 1,
          alignItems: "center",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.21,
          shadowRadius: 7.68,
          elevation: 10,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            marginLeft: 50,
            fontSize: 18,
            fontWeight: "600",
            marginTop: 10,
            marginBottom: 5,
            textAlign: "left",
            width: "100%",
          }}
        >
          {selectedDate}
        </Text>
        {selectedDate in availableEvents ? (
          <ScrollView style={{ flex: 1, width: "100%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                flex: 1,
                width: "100%",
              }}
            >
              {availableEvents[selectedDate].map((e) => (
                <AgendaItem
                  key={e.id}
                  item={e}
                  user={user}
                  formData={formData}
                  event={event}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={{ marginTop: 50 }}>
            <Text>今日無可預約時段！</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const AgendaItem = (props) => {
  const { item, formData, event, user } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(0);
  const formDataWithDate = {
    date: item.date,
    time: item.title,
    ...formData,
  };

  const getFormattedData = () => {
    const formattedReact = (
      <View style={{ alignItems: "center", marginHorizontal: 20 }}>
        <Text style={styles.keyText}>個案姓名</Text>
        <Text style={styles.valueText}>{formDataWithDate.name}</Text>
        <Text style={styles.keyText}>出生年月日</Text>
        <Text style={styles.valueText}>{formDataWithDate.birthDate}</Text>
        <Text style={styles.keyText}>聯絡人姓名</Text>
        <Text style={styles.valueText}>{formDataWithDate.contactName}</Text>
        <Text style={styles.keyText}>與身障者關係</Text>
        <Text style={styles.valueText}>{formDataWithDate.relationship}</Text>
        <Text style={styles.keyText}>聯絡電話</Text>
        <Text style={styles.valueText}>{formDataWithDate.phoneNumber}</Text>
        <Text style={styles.keyText}>Line ID</Text>
        <Text style={styles.valueText}>{formDataWithDate.lineId}</Text>
        <Text style={styles.keyText}>選擇時段</Text>
        <Text
          style={styles.valueText}
        >{`${formDataWithDate.date}\n${formDataWithDate.time}`}</Text>
      </View>
    );
    const formattedText = `個案姓名：${formDataWithDate.name}
出生年月日：${formDataWithDate.birthDate}
聯絡人姓名：${formDataWithDate.contactName}
與身障者關係：${formDataWithDate.relationship}
聯絡電話：${formDataWithDate.phoneNumber}
Line ID：${formDataWithDate.lineId}
選擇時段：${formDataWithDate.date} ${formDataWithDate.time}`;
    return [formattedReact, formattedText];
  };

  const onSubmit = async () => {
    const token = await getToken();
    const del = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${item.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await fetch(
      `https://timetreeapis.com/calendars/${TIMETREE_CALENDAR_ID}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TIMETREE_ACCESS_TOKEN}`,
          Accept: "application/vnd.timetree.v1+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              title: `${user.attributes.name} – ${item.summary}`,
              category: "schedule",
              start_at: item.start.dateTime,
              start_timezone: item.start.timeZone,
              end_at: item.end.dateTime,
              end_timezone: item.end.timeZone,
              all_day: false,
              description: getFormattedData()[1],
            },
            relationships: {
              label: {
                data: {
                  id: "1",
                  type: "label",
                },
              },
            },
          },
        }),
      }
    );
    const res2 = await API.graphql({
      query: mutations.createRegistration,
      variables: {
        input: {
          data: JSON.stringify(formDataWithDate),
          registrationEventId: event.id,
          email: user.attributes.email,
        },
      },
    });
    const apiName = "sendEmail";
    const path = "/email";
    const res3 = await API.post(apiName, path, {
      body: {
        eventName: event.title,
        text: getFormattedData()[1],
        user: user.attributes,
      },
    });
  };

  return (
    <>
      <AppButton
        title={item.title}
        onPress={() => {
          setModalVisible(true);
        }}
        style={{ marginVertical: 5, width: "46%", marginHorizontal: "2%" }}
      />
      <AppModal
        open={modalVisible}
        setOpen={setModalVisible}
        status={status}
        setStatus={setStatus}
        onSubmit={onSubmit}
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
        {getFormattedData()[0]}
      </AppModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: "20%",
    paddingVertical: 10,
    borderRadius: 10,
    width: 200,
    alignSelf: "center",
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  section: {
    backgroundColor: "#fff",
    color: "grey",
    textTransform: "capitalize",
  },
  item: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
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
