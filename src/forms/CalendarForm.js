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
import { CalendarList } from "react-native-calendars";
import colors from "../theme/colors";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import AppModal from "../components/AppModal";
import * as mutations from "../graphql/mutations";
import { API } from "aws-amplify";

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

      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?timeMin=${now}&timeMax=${twoWeeksLater.toISOString()}&singleEvents=true`,
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

  const onSubmit = async () => {
    const formDataWithDate = {
      date: item.date,
      startTime: item.start.dateTime,
      endTime: item.end.dateTime,
      ...formData,
    };
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
              title: `User – ${item.summary}`,
              category: "schedule",
              start_at: item.start.dateTime,
              start_timezone: item.start.timeZone,
              end_at: item.end.dateTime,
              end_timezone: item.end.timeZone,
              all_day: false,
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
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 15 }}>
          您選擇的時段為
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.date}</Text>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.title}</Text>
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
});
