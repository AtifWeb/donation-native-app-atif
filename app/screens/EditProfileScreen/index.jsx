import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/common/AppButton";
import { editProfile } from "../../config/profileList";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation }) => {
  const [UserId, setUserId] = useState("");
  const [UserData, setUserData] = useState({});
  const [Phone, setPhone] = useState("");
  const [Name, setName] = useState("");

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
                setUserId(doc.id);
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
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Image source={{ uri: UserData?.ImageSelect }} style={styles.image} />
      <Text style={styles.title}>{UserData?.Name}</Text>
      <Text style={styles.subTitle}>{UserData?.Email}</Text>
      {editProfile.map((item) => (
        <View key={item.id.toString()} style={{ width: "100%" }}>
          <AppTextInput
            placeholder={item.placeholder}
            onChangeText={(text) => {
              if (item.placeholder == "Name") {
                setName(text);
              } else if (item.placeholder == "phoneNumber") {
                setPhone(text);
              }
            }}
          />
        </View>
      ))}
      <View style={styles.button}>
        <AppButton
          title="Save"
          onPress={(e) => {
            const docRef = doc(db, "Users", UserId);
            updateDoc(docRef, { Name: Name, phoneNumber: Phone }).then(
              (docRef) => {
                if (UserData.accountType == "NGO") {
                  navigation.navigate("HomeNGOScreen");
                } else {
                  navigation.navigate("HomeScreen");
                }
              }
            );
          }}
        />
      </View>
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
  button: {
    marginTop: RFPercentage(5),
  },
});

export default EditProfileScreen;
