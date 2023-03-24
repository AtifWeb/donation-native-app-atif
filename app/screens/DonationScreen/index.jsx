import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import DonationList from "../../components/DonationList";
import ProfileButton from "../../components/common/ProfileButton";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonationScreen = ({ navigation }) => {
  const [postsdate, setPostsData] = useState([]);
  const [selfPost, setselfPost] = useState([]);
  const home = require("../../../assets/home.png");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("email");

        if (value) {
          const SelfArray = [];
          const OtherArray = [];
          const querySnapshot = getDocs(collection(db, "Donation")).then(
            (res) => {
              res.forEach((doc) => {
                console.log(doc.data().donation_email == value);
                if (doc.data().donation_email == value) {
                  SelfArray.push(doc.data());
                } else {
                  OtherArray.push(doc.data());
                }
              });
              setPostsData(OtherArray);
              setselfPost(SelfArray);
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
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Live Donations</Text>
          {postsdate.map((item, key) => (
            <View key={key} style={{ alignItems: "center", width: "100%" }}>
              <DonationList
                image={item?.donation_image}
                header={item.item_name}
                quantity={item.Quantity}
                time={item.time}
                date={item.date}
                check={false}
              />
            </View>
          ))}
          <Text style={styles.heading}>Your Donations</Text>
          {selfPost.map((item, key) => (
            <View key={key} style={{ alignItems: "center", width: "100%" }}>
              <DonationList
                image={item?.donation_image}
                header={item.item_name}
                quantity={item.Quantity}
                time={item.time}
                date={item.date}
                check={false}
              />
            </View>
          ))}
        </View>
      </ScrollView>
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
    marginTop: RFPercentage(10),
  },
});

export default DonationScreen;
