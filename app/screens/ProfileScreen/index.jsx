import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import ProfileList from "../../components/ProfileList";
import { profileList, profileSecondList } from "../../config/profileList";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ProfileScreen = ({ navigation }) => {
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
                SelfArray.push(doc.data());
              }
            });
            setUserData(...SelfArray);
            console.log(SelfArray);
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
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Image source={{ uri: UserData?.ImageSelect }} style={styles.image} />
      <Text style={styles.title}>{UserData?.Name}</Text>
      <Text style={styles.subTitle}>{UserData?.Email}</Text>
      <FlatList
        data={profileList}
        renderItem={({ item }) => (
          <ProfileList
            icon={item.icon}
            listTitle={item.listTitle}
            route={item.route}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id}
        style={{ marginBottom: RFPercentage(3) }}
      />
      <FlatList
        data={profileSecondList}
        renderItem={({ item }) => (
          <ProfileList
            icon={item.icon}
            navigation={navigation}
            listTitle={item.listTitle}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  heading: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginVertical: RFPercentage(2),
  },
  image: {
    borderRadius: RFValue(50),
    height: RFPercentage(15),
    marginBottom: RFPercentage(3),
    width: RFPercentage(15),
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "500",
    marginBottom: RFPercentage(1),
    textDecorationLine: "underline",
  },
  subTitle: {
    color: "rgb(161, 161, 161)",
    fontSize: RFValue(14),
    marginBottom: RFPercentage(3),
  },
});

export default ProfileScreen;
