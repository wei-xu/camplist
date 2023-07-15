import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "../inventory/data.json";
import { Camplist } from "../model/ListType";
import config from "../config/config.json"

const ChecklistScreen = () => {
  const [fullItemList, setFullItemList] = useState([]);

  // const { setCamplistsFunc } = useLocalSearchParams<{ setCamplistsFunc: any}>();

  const router = useRouter();

  useEffect(() => {
    // fetchItemsFromStorage();
    initializeItems();
  }, []);

  const packSelectedItems = (selectedItems: any) => {
    const timeNow = Date.now();
    const cl: Camplist = {
      name: `Saved list ${new Date(timeNow).toLocaleString()}`,
      created_timestamp: timeNow,
      data: selectedItems,
      version: config.version,
    };
    return cl;
  };

  const saveItemsToStorage = async (packedSelectedItems: any) => {
    try {
      await AsyncStorage.setItem(
        `app-camplist-${packedSelectedItems["created_timestamp"]}`,
        JSON.stringify(packedSelectedItems)
      );
      console.log("save items to storage: ", packedSelectedItems);
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
    const selectedItems = fullItemList
      .filter((item) => item.checked)
      .map((item) => item["name"]);

    const packed = packSelectedItems(selectedItems);
    saveItemsToStorage(packed);

    // setCamplistsFunc((prevItems) =>
    //   [...prevItems, packed]
    // )

    // set the state in main page
    router.push({
      pathname: "/",
      params: { newItemAdded: true, newList: JSON.stringify(packed) },
    });
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
