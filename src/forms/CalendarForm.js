import React from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AppTextInput from "../components/AppTextInput";
import { getTokenAndSubmitToSheets } from "../functions";

// // Config variables
// const SPREADSHEET_ID = Config.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = Config.REACT_APP_SHEET_ID;
// const CLIENT_EMAIL = Config.REACT_APP_GOOGLE_CLIENT_EMAIL;
// const PRIVATE_KEY = Config.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

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
    getTokenAndSubmitToSheets([row], 263936640);
  };

  return (
    <View>
      <Text>This is calendar form</Text>
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
