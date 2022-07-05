import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import { getToken, getTokenAndSubmitToSheets } from "../functions";
import { CALENDAR_ID } from "@env";
import AppButton from "../components/AppButton";

export default function AppForm() {
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
          formattedEvents[startDate].add(data);
        } else {
          formattedEvents[startDate] = [data];
        }
      }
      console.log(formattedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (row) => {
    let arr = [];
    for (let key in row) {
      switch (typeof row[key]) {
        case "string":
          arr.push({
            userEnteredValue: {
              stringValue: row[key],
            },
          });
          break;
        case "number":
          arr.push({
            userEnteredValue: {
              numberValue: row[key],
            },
          });
          break;
        default:
      }
    }
    row = { values: arr };
    // getTokenAndSubmitToSheets([row], 263936640);
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
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {selectedDate in availableEvents ? (
              availableEvents[selectedDate].map((e) => <AgendaItem item={e} />)
            ) : (
              <Text>今日無可預約時段！</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const AgendaItem = (props) => {
  const { item } = props;

  return <AppButton title={item.title} />;
};
