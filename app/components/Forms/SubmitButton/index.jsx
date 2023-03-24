import React from "react";
import { useFormikContext } from "formik";
import AppButton from "../../common/AppButton";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";

import { db, auth } from "../../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
function SubmitButton({
  title,
  type = null,
  navigationLocal = null,
  DropdownData = null,
  ImageSelect = null,
}) {
  const { values, submitForm } = useFormikContext();
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("email", value);
      const querySnapshot = getDocs(collection(db, "Users")).then((res) => {
        res.forEach((doc) => {
          if (doc.data().Email.toLowerCase() == value.toLowerCase()) {
            if (doc.data().accountType == "NGO") {
              navigationLocal.navigate("HomeNGOScreen");
            } else {
              navigationLocal.navigate("HomeScreen");
            }
          }
        });
      });
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  return (
    <AppButton
      title={title}
      onPress={(e) => {
        submitForm();
        if (type == "reg") {
          if (ImageSelect == null) {
            window.alert("Please Choose Image");
          } else {
            createUserWithEmailAndPassword(auth, values.email, values.password)
              .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
                const docRef = addDoc(collection(db, "Users"), {
                  ImageSelect: ImageSelect,
                  Email: values.email,
                  Name: values.fullName,
                  password: values.password,
                  phoneNumber: values.phoneNumber,
                  accountType: DropdownData == 1 ? "NGO" : "RESTAURENT",
                }).then((res) => {
                  console.log("login");
                  navigationLocal.navigate("LoginScreen");
                });
              })
              .catch((error) => alert(error.message));
          }
        }
        if (type == "log") {
          signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredentials) => {
              const user = userCredentials;
              storeData(user["user"].email);
            })
            .catch((error) => alert(error.message));
        }
      }}
    />
  );
}

export default SubmitButton;
