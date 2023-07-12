import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { data } from "../inventory/data.json";

const ChecklistScreen = () => {
  const [fullItemList, setFullItemList] = useState([]);

  const router = useRouter();
  useEffect(() => {
    // fetchItemsFromStorage();
    initializeItems();
  }, []);

  const fetchItemsFromStorage = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("checklistItems");

      if (storedItems !== null) {
        const parsedItems = JSON.parse(storedItems);

        if (parsedItems.length == 0) {
          // maybe worth to check Array.isArray(parsedItems)
          initializeItems();
        } else {
          setItems(parsedItems);
        }
      } else {
        console.log("storage items is null");
        initializeItems();
      }
    } catch (error) {
      console.log("Error retrieving checklist items:", error);
    }
  };

  const saveItemsToStorage = async (selectedItems) => {
    try {
      await AsyncStorage.setItem(
        `app-camplist-${Date.now()}`,
        JSON.stringify(selectedItems)
      );
    } catch (error) {
      console.log("Error saving checklist items:", error);
    }
  };

  const handleToggleCheckbox = (itemId) => {
    setFullItemList((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = () => {
    const selectedItems = fullItemList.filter((item) => item.checked);
    console.log("Selected items:", selectedItems);
    // navigation.navigate('SecondScreen', { selectedItems });
    router.replace("/");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => handleToggleCheckbox(item.id)}
    >
      <View>
        {item.checked ? (
          <MaterialCommunityIcons
            name="checkbox-marked-outline"
            size={24}
            color="black"
          />
        ) : (
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={24}
            color="black"
          />
        )}
      </View>
      <Text style={styles.inventoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // useEffect(() => {
  //   // saveItemsToStorage();
  //   // AsyncStorage.removeItem("checklistItems");
  // }, [items]);

  const initializeItems = async () => {
    const itemlist = Object.values(data).flat();

    const initialItems = itemlist.map((itemName, index) => ({
      id: index,
      name: itemName,
      checked: false,
    }));

    setFullItemList(initialItems);
  };

  const renderSeparator = () => <View style={styles.separator} />;
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
            headerTitle: "Create A List",
          }}
        />
        <FlatList
          data={fullItemList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatlistContainer}
        />
        {fullItemList.filter((item) => item.checked).length != 0 ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Selection</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
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

export default ChecklistScreen;
