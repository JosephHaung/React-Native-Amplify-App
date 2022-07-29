import React from "react";
import Modal from "react-native-modal";
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
import { useNavigation } from "@react-navigation/native";
import AppButton from "./AppButton";

export default ({ open, setOpen, status, setStatus, children, onSubmit }) => {
  const navigation = useNavigation();

  const render = () => {
    switch (status) {
      case 0:
        return (
          <>
            {children}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                marginTop: 15,
              }}
            >
              <AppButton
                title="取消"
                onPress={() => setOpen(false)}
                style={{ width: "40%", marginRight: "2%" }}
              />
              <AppButton
                title="確認"
                onPress={onSubmit}
                style={{ width: "40%", marginLeft: "2%" }}
              />
            </View>
          </>
        );
      case 1:
        return (
          <View
            style={{
              justifyContent: "center",
              height: 150,
              width: "100%",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        );
      case 2:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: 150,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 35 }}>
              預約成功！
            </Text>
            <AppButton
              title="確認"
              style={{ width: "80%", marginBottom: 10 }}
              onPress={() => {
                setStatus(0);
                navigation.navigate("Home");
              }}
            />
          </View>
        );
      default:
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              height: 150,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 35 }}>
              預約失敗 請稍後再試
            </Text>
            <AppButton
              title="確認"
              style={{ width: "80%", marginBottom: 10 }}
              onPress={() => {
                setOpen(false);
              }}
            />
          </View>
        );
    }
  };

  return (
    <Modal
      isVisible={open}
      onBackdropPress={() => {
        setOpen(false);
      }}
    >
      <View style={styles.modalContainer}>{render()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});
