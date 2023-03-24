import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppTextInput from "../../components/AppTextInput";
import ProfileButton from "../../components/common/ProfileButton";
import { db } from "../../../config";
import colors from "../../config/colors";
import { ngoForm } from "../../config/donationForm";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NGOFormScreen = ({ navigation }) => {
  const [time, settime] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Address, setAddress] = useState("");
  const [Desc, setDesc] = useState("");
  const [UserData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem("email");
        console.log(value);
        if (value) {
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
    try {
      const value = await AsyncStorage.getItem("email");
      if (value) {
        const docRef = addDoc(collection(db, "DonationRequest"), {
          donation_image: UserData.ImageSelect,
          donation_email: value,
          time: time,
          Quantity: Quantity,
          Address: Address,
          Desc: Desc,
        }).then((res) => {
          navigation.navigate("HomeNGOScreen");
        });
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Food Details:</Text>
        {ngoForm.map((item) => (
          <View key={item.id.toString()}>
            <AppTextInput
              placeholder={item.placeholder}
              onChangeText={(text) => {
                if (item.placeholder == "Quantity") {
                  setQuantity(text);
                } else if (item.placeholder == "Location") {
                  setAddress(text);
                } else if (item.placeholder == "Need Before") {
                  settime(text);
                }
              }}
            />
          </View>
        ))}
        <View style={styles.description}>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            style={styles.textInput}
            placeholder="Description"
            onChangeText={(text) => {
              setDesc(text);
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

export default NGOFormScreen;
