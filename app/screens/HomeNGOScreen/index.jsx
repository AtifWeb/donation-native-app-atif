import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import HomeButton from "../../components/HomeButton";
import ProfileButton from "../../components/common/ProfileButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeNGOScreen = ({ navigation }) => {
  const [userdata, setuserdata] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        let value = await AsyncStorage.getItem("email");
        const querySnapshot = getDocs(collection(db, "Users")).then((res) => {
          res.forEach((doc) => {
            if (doc.data().Email.toLowerCase() == value.toLowerCase()) {
              setuserdata(doc.data());
            }
          });
        });
      } catch (e) {
        // saving error
        console.log(e);
      }
    };
    getData();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.opening}>Welcome Back {userdata?.Name}</Text>
        <Image
          source={{ uri: userdata?.ImageSelect }}
          style={{ height: 250, width: 250, borderRadius: 20 }}
        />
        <HomeButton
          title="Post Donation Request"
          onPress={() => navigation.navigate("NGOFormScreen")}
        />

        <HomeButton
          title="Donation Requests"
          onPress={() => navigation.navigate("RequestScreenNGO")}
        />

        <HomeButton
          title="Request History"
          onPress={() => navigation.navigate("DonationScreen")}
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
    paddingVertical: RFPercentage(15),
  },
  opening: {
    fontSize: RFValue(20),
    fontWeight: "900",
    paddingHorizontal: RFPercentage(8),
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

export default HomeNGOScreen;
