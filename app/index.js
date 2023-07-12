import { Stack, useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mylist = () => {
  const router = useRouter(); // hooks need to be defined directly in top level component

  const handleAdd = () => {
    router.push("/new-list");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      /* setting SafeAreaView within a stack layout and an 
    built-in header, SafeAreaView may add extra margin on the top 
    that creates a gap between the view and the header.
    using edges to ignore "top" may resolve the issue

    detail: https://github.com/th3rdwave/react-native-safe-area-context#edges

    */
      edges={["left", "right", "bottom"]}
    >
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: "Camplist",
            headerRight: () => <Button title="Add" onPress={handleAdd} />,
          }}
        />
        
        <Text>mylist</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
export default mylist;
