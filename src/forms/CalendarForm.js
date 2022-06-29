import React, { useEffect } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import { getToken, getTokenAndSubmitToSheets } from "../functions";
import { CALENDAR_ID } from "@env";

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
      console.log(events);
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

  return (
    <View>
      <Text>This is calendar form</Text>
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
