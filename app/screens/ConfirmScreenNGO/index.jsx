import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ProfileButton from "../../components/common/ProfileButton";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CardNGO from "../../components/CardNGO";

const ConfirmScreenNGO = ({ navigation, route }) => {
  const item = route.params;

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Confirm Requests</Text>
        <CardNGO item={item} navigation={navigation} />
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
  },
  heading: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginVertical: RFPercentage(3),
  },
  footer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 0.1,
    marginBottom: RFPercentage(2),
    marginRight: RFPercentage(3),
  },
});

export default ConfirmScreenNGO;
