import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import RequestList from "../../components/RequestList";
import ProfileButton from "../../components/common/ProfileButton";
import { requestData } from "../../config/requestData";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";

const RequestScreen = ({ navigation }) => {
  const [PostsData, setPostsData] = useState([]);
  const img = require("../../../assets/request.png");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("email");

        if (value) {
          const OtherArray = [];
          const querySnapshot = getDocs(collection(db, "DonationRequest")).then(
            (res) => {
              res.forEach((doc) => {
                OtherArray.push(doc.data());
              });
              setPostsData(OtherArray);
            }
          );
        }
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Donations Requests</Text>
        <FlatList
          data={PostsData}
          renderItem={({ item }) => (
            <RequestList
              image={item.donation_image}
              title={item.donation_email}
              details={item.Desc}
              time={item.time}
              onPress={() => navigation.navigate("ConfirmScreen", item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.footer}>
        <ProfileButton navigation={navigation} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 0.9,
  },
  heading: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: RFPercentage(2),
    marginTop: RFPercentage(3),
  },
  footer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 0.1,
    marginBottom: RFPercentage(2),
    marginRight: RFPercentage(3),
  },
});

export default RequestScreen;
