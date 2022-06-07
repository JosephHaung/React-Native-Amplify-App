import React from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Config from "react-native-config";

// Config variables
const SPREADSHEET_ID = Config.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = Config.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = Config.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = Config.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

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
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];
      const result = await sheet.addRow(row);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstName"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
