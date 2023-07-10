import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "@react-native-community/checkbox";

const ChecklistScreen = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItemsFromStorage();
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

  const saveItemsToStorage = async () => {
    try {
      await AsyncStorage.setItem("checklistItems", JSON.stringify(items));
    } catch (error) {
      console.log("Error saving checklist items:", error);
    }
  };

  const handleToggleCheckbox = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = () => {
    const selectedItems = items.filter((item) => item.checked);
    console.log("Selected items:", selectedItems);
    // navigation.navigate('SecondScreen', { selectedItems });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => handleToggleCheckbox(item.id)}
    >
      <View
        style={[
          styles.checkbox,
          { backgroundColor: item.checked ? "#007AFF" : "#EFEFEF" },
        ]}
      >
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{item.name}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    saveItemsToStorage();
  }, [items]);

  const initializeItems = async () => {
    const initialItems = [
      { id: 1, name: "Test Item 1", checked: false },
      { id: 2, name: "Test Item 2", checked: false },
      { id: 3, name: "Test Item 3", checked: false },
    ];
    setItems(initialItems);
    try {
      await AsyncStorage.setItem(
        "checklistItems",
        JSON.stringify(initialItems)
      );
    } catch (error) {
      console.log("Error initializing checklist items:", error);
    }
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
            headerTitle: "Create A List",
          }}
        />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatlistContainer}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
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
});

export default ChecklistScreen;
