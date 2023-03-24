import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import HomeButton from "../../components/HomeButton";
import ProfileButton from "../../components/common/ProfileButton";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config";
const HomeScreen = ({ navigation }) => {
  const [UserData, setUserData] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("email");
        console.log(value);
        if (value) {
          const SelfArray = [];
          const querySnapshot = getDocs(collection(db, "Users")).then((res) => {
            res.forEach((doc) => {
              if (doc.data().Email.toLowerCase() == value.toLowerCase()) {
                setUserData(doc.data());
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        // error reading value
      }
    };

    getData();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.opening}>Welcome Back {UserData?.Name}!</Text>
        {UserData?.ImageSelect && (
          <Image
            source={{ uri: UserData.ImageSelect }}
            style={{ width: 250, height: 250, borderRadius: 20 }}
          />
        )}

        <HomeButton
          title="Make a Donation"
          onPress={() => navigation.navigate("DonationFormScreen")}
        />
        <HomeButton
          title="Your Donations"
          onPress={() => navigation.navigate("DonationScreen")}
        />
        <HomeButton
          title="Donation Requests"
          onPress={() => navigation.navigate("RequestScreen")}
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
    justifyContent: "space-around",
    paddingVertical: RFPercentage(8),
  },
  opening: {
    fontSize: RFValue(20),
    fontWeight: "900",
    paddingHorizontal: RFPercentage(10),
    textAlign: "center",
  },
  footer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 0.1,
    marginBottom: RFPercentage(2),
    marginRight: RFPercentage(3),
  },
});

export default HomeScreen;
