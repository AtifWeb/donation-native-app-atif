import React, { useEffect, useState } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity } from "react-native";

import colors from "../../config/colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CardNGO = ({ navigation, item }) => {
  const [UserData, setuserdata] = useState(null);
  const [ConfirmByState, setConfirmByState] = useState(null);
  useEffect(() => {
    console.log(item.donation_image);
  }, []);
  const ConfirmThisDonation = async (e) => {
    try {
      const value = await AsyncStorage.getItem("email");
      if (value) {
        const docRef = addDoc(collection(db, "DonationConfirm"), {
          confirm_by: value,
          donation_email: item.donation_email,
          time: item.time,
          Quantity: item.Quantity,
          Address: item.Address,
        }).then((res) => {
          navigation.navigate("HomeNGOScreen");
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        let UserEmail = "";
        const querySnapshot = getDocs(collection(db, "DonationConfirm")).then(
          (res) => {
            res.forEach((doc) => {
              if (
                doc.data().donation_email.toLowerCase() ==
                item.donation_email.toLowerCase()
              ) {
                console.log(doc.data());
                UserEmail = doc.data().confirm_by;
                setuserdata(doc.data());
              }
            });
          }
        );

        const querySnapshot2 = getDocs(collection(db, "Users")).then((res) => {
          res.forEach((doc) => {
            if (doc.data().Email.toLowerCase() == UserEmail.toLowerCase()) {
              setConfirmByState(doc.data());
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
        <View style={styles.upper}>
          <Image source={{ uri: item.donation_image }} style={styles.image} />
          <Text style={styles.header}>{item.title}</Text>
        </View>
        <View style={styles.lower}>
          <View>
            <Text style={styles.element}>Quantity: {item.Quantity}</Text>
            <Text style={styles.element}>Need Before - {item.time}</Text>
          </View>
          <View style={styles.description}>
            <Text style={{ fontSize: RFValue(10), fontWeight: "bold" }}>
              Address:
            </Text>
            <Text style={{ fontSize: RFValue(10), marginTop: RFPercentage(1) }}>
              {item.Address}
            </Text>
          </View>
        </View>
      </View>
      {UserData == null && (
        <TouchableOpacity
          onPress={(e) => {
            console.log("work");
            ConfirmThisDonation();
          }}
        >
          <View style={styles.button}>
            <Text style={{ fontWeight: "bold" }}>CONFIRM</Text>
          </View>
        </TouchableOpacity>
      )}
      {UserData != null && (
        <View style={styles.popup}>
          <Image
            source={{
              uri: ConfirmByState?.ImageSelect,
            }}
            style={styles.popupImage}
          />
          <View>
            <Text style={styles.sm_heading}>Accepted by:</Text>
            <Text style={styles.name_heading}>{ConfirmByState?.Name}</Text>
            <Text style={styles.sm_heading}>
              Phone: {ConfirmByState?.phoneNumber}
            </Text>
            <Text style={styles.sm_heading}>
              Email:{ConfirmByState?.Email}{" "}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(233, 244, 243)",
    borderRadius: RFValue(12),
    elevation: 2,
    height: RFPercentage(60),
    justifyContent: "space-around",
    paddingHorizontal: RFPercentage(3),
    width: "90%",
  },
  upper: {
    alignItems: "center",
    height: RFPercentage(25),
    justifyContent: "space-around",
  },
  lower: {
    height: RFPercentage(25),
    justifyContent: "space-around",
  },
  image: {
    borderRadius: 10,
    height: RFPercentage(28),
    width: RFPercentage(28),
  },
  header: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    paddingHorizontal: RFPercentage(5),
    textAlign: "center",
    textDecorationLine: "underline",
  },
  element: {
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  description: {
    backgroundColor: colors.white,
    borderRadius: RFValue(10),
    justifyContent: "space-around",
    paddingLeft: RFPercentage(1),
    paddingRight: RFPercentage(5),
    paddingVertical: RFPercentage(1),
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: RFValue(10),
    height: RFPercentage(3.5),
    justifyContent: "center",
    marginLeft: RFPercentage(20),
    marginTop: RFPercentage(5),
    width: RFPercentage(17),
  },
  popup: {
    position: "absolute",
    bottom: 30,
    right: 30,
    flexDirection: "row",
  },
  popupImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
  },
  sm_heading: {
    fontSize: 12,
  },
  name_heading: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default CardNGO;
