import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppCard from "../components/AppCard";
import { Items, Page, News } from "../models";
import { DataStore, Storage, API } from "aws-amplify";
import colors from "../theme/colors";
import AWS from "aws-sdk";
import { SECRET_KEY_ID, SECRET_ACCESS_KEY } from "@env";
import { listItems } from "../graphql/queries";

export default AppDetailPage = ({ route }) => {
  const renderItem = ({ item }) => (
    <AppCard item={item} user={route.params.user} />
  );
  const [events, setEvents] = useState([]);

  useEffect(async () => {
    const events = await DataStore.query(Items, (item) =>
      item.page("eq", Page[route.params.pageName])
    );
    // const events = await API.graphql({ query: listItems });
    console.log(events);
    const s3 = new AWS.S3({
      accessKeyId: SECRET_KEY_ID,
      signatureVersion: "v4",
      region: "us-east-1",
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let imageURIs = [];
      for (let image of event.images) {
        const uri = s3.getSignedUrl("getObject", {
          Bucket: "awesomeprojectstorage232054-dev",
          Key: "public/" + image,
        });
        imageURIs.push({ uri });
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
