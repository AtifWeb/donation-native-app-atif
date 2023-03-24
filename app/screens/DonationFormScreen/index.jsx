import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "../../components/common/AppButton";
import AppTextInput from "../../components/AppTextInput";
import DropdownComponent from "../../components/common/DropdownComponent";
import ProfileButton from "../../components/common/ProfileButton";
import { addDoc, collection, getDocs } from "firebase/firestore";
import colors from "../../config/colors";
import { donationForm } from "../../config/donationForm";
import { db } from "../../../config";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DonationFormScreen = ({ navigation }) => {
  const data = [
    { label: "Yes", value: "1" },
    { label: "No", value: "2" },
  ];
  const [item_name, setItem_name] = useState("");
  const [time, settime] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Address, setAddress] = useState("");
  const [DropdownData, setDropdownData] = useState("");
  const [UserData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
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

    getUserData();
  }, []);

  const getData = async () => {
    console.log(UserData.ImageSelect);
    try {
      const value = await AsyncStorage.getItem("email");
      if (value) {
        const docRef = addDoc(collection(db, "Donation"), {
          donation_image: UserData.ImageSelect,
          donation_email: value,
          item_name: item_name,
          time: time,
          Quantity: Quantity,
          Address: Address,
          DropdownData: DropdownData == 1 ? "Yes" : "No",
        }).then((res) => {
          navigation.navigate("HomeScreen");
        });
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Food Details:</Text>
        {donationForm.map((item) => (
          <View key={item.id.toString()}>
            <AppTextInput
              placeholder={item.placeholder}
              onChangeText={(text) => {
                if (item.placeholder == "Item Name") {
                  setItem_name(text);
                } else if (item.placeholder == "Time of Preparation") {
                  settime(text);
                } else if (item.placeholder == "Quantity") {
                  setQuantity(text);
                }
              }}
            />
          </View>
        ))}
        <DropdownComponent
          data={data}
          placeholder="Utensils"
          setDropdownData={setDropdownData}
        />
        <View style={styles.description}>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            style={styles.textInput}
            placeholder="Address"
            onChangeText={(text) => {
              setAddress(text);
            }}
          />
        </View>
        <View style={styles.button}>
          <AppButton
            title="Submit"
            onPress={() => {
              getData();
            }}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <ProfileButton navigation={navigation} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    marginTop: RFPercentage(2),
  },
  heading: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    margin: RFPercentage(3),
  },
  description: {
    alignItems: "center",
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: RFValue(12),
    marginVertical: RFPercentage(1),
    paddingBottom: RFPercentage(7),
    paddingLeft: RFPercentage(2),
    width: RFPercentage(41),
  },
  button: {
    alignItems: "center",
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

export default DonationFormScreen;
