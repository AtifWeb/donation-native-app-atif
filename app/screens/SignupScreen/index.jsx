import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePickerExpo from "expo-image-picker";
import AppForm from "../../components/Forms/AppForm";
import AppFormField from "../../components/Forms/AppFormField";
import DropdownComponent from "../../components/common/DropdownComponent";
import SubmitButton from "../../components/Forms/SubmitButton";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as Yup from "yup";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import colors from "../../config/colors";

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/(\w.+\s).+/, "Enter at least 2 names")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .matches(
      /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm,
      "Enter a valid phone number"
    )
    .required("Phone number is required"),
  email: Yup.string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, "Password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
    .matches(/\d/, "Password must have a number")
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      "Password must have a special character"
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const SignUpScreen = ({ navigation }) => {
  const data = [
    { label: "NGO", value: "1" },
    { label: "Restaurant", value: "2" },
  ];
  const [DropdownData, setDropdownData] = useState("");
  const [ImageSelect, setImageSelect] = useState(null);

  const ImagePicker = async (setImageSelect = null) => {
    let result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.assets[0].uri, true);
        xhr.send(null);
      });

      const storage = getStorage();
      const storageRef = ref(storage, "imgaes/" + Date.now());
      const metadata = {
        contentType: "image/jpeg",
      };

      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageSelect(downloadURL);
          });
        }
      );
    }
  };

  return (
    <ScrollView style={styles.background}>
      <View style={{ alignItems: "center", marginTop: RFPercentage(2) }}>
        <TouchableOpacity
          style={styles.logo}
          onPress={(e) => ImagePicker(setImageSelect)}
        >
          {ImageSelect ? (
            <Image
              source={{ uri: ImageSelect }}
              style={{
                height: RFPercentage(15),
                width: RFPercentage(15),
                borderRadius: 60,
              }}
            />
          ) : (
            <Text style={styles.text}>UPLOAD PHOTO</Text>
          )}
        </TouchableOpacity>
        <View style={styles.components}>
          <AppForm
            initialValues={{
              fullName: "",
              phoneNumber: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values) => {
              console.log(values);
              console.log(`${values} atif`);
            }}
            validationSchema={validationSchema}
          >
            <AppFormField
              text="Name"
              name="fullName"
              textContentType="name"
              placeholder="Name"
            />
            <AppFormField
              keyboardType="phone-pad"
              name="phoneNumber"
              placeholder="Phone Number"
              text="Contact"
              textContentType="telephoneNumber"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="email"
              placeholder="Email"
              text="Email"
              textContentType="emailAddress"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              name="password"
              placeholder="Password"
              secureTextEntry
              text="Password"
              textContentType="password"
            />
            <DropdownComponent
              data={data}
              placeholder="Select"
              setDropdownData={setDropdownData}
            />
            <View style={styles.signupButton}>
              <SubmitButton
                title="Sign Up"
                type="reg"
                ImageSelect={ImageSelect}
                DropdownData={DropdownData}
                navigationLocal={navigation}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.login}>Sign In Instead</Text>
            </TouchableOpacity>
          </AppForm>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    flex: 1,
  },
  logo: {
    alignItems: "center",
    backgroundColor: "rgb(229, 231, 230)",
    borderRadius: 60,
    height: RFPercentage(15),
    justifyContent: "center",
    width: RFPercentage(15),
  },
  text: {
    fontSize: RFValue(14),
    fontWeight: "500",
    paddingHorizontal: RFPercentage(1),
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 80,
  },
  components: {
    flex: 0.6,
    marginTop: RFPercentage(5),
    width: "100%",
  },
  signupButton: {
    alignItems: "center",
    marginBottom: RFPercentage(4),
    marginTop: 15,
  },
  login: {
    color: "rgba(0, 133, 255, 1)",
    fontWeight: "500",
    marginBottom: 40,
    marginLeft: 30,
    marginTop: 10,
  },
});

export default SignUpScreen;
