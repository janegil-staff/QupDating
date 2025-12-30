import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
});
