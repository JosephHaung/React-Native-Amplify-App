import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppCard from "../components/AppCard";
import { Items, Page, News } from "../models";
import { DataStore, Storage } from "aws-amplify";
import colors from "../theme/colors";

export default AppDetailPage = ({ route }) => {
  const renderItem = ({ item }) => (
    <AppCard item={item} user={route.params.user} />
  );
  const [events, setEvents] = useState([]);

  useEffect(async () => {
    const events = await DataStore.query(Items, (item) =>
      item.page("eq", Page[route.params.pageName])
    );

    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let imageURIs = [];
      for (let image of event.images) {
        const imageUri = await Storage.get(image);
        imageURIs.push({ uri: imageUri });
      }
      const eventUpdatedUri = { ...event, images: imageURIs };
      events[i] = eventUpdatedUri;
    }
    console.log(events);
    setEvents(events);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    //marginHorizontal: 10,
    width: "100%",
    backgroundColor: colors.background,
  },
});
