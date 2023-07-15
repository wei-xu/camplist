import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { Camplist } from "../model/ListType";

const ListDetails = () => {
  const { cl, cl_obj, obj } = useLocalSearchParams();
  console.log("passedItemlist: ", cl);
  console.log("cl_obj: ", cl_obj);
  console.log("obj: ", obj["some"]);

  const camplist: Camplist = JSON.parse(cl as string);

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item }) => {

    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
      >
        <Text style={styles.inventoryName}>{item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={["left", "right", "bottom"]}
    >
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: "List Details",
          }}
        />
        <FlatList
          data={camplist["data"]}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatlistContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  flatlistContainer: {
    paddingBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
  },
  inventoryName: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "grey",
  },
});

export default ListDetails;
