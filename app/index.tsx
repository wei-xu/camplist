import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/config.json";
import { Camplist } from "../model/ListType";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const mylist = () => {
  const router = useRouter(); // hooks need to be defined directly in top level component
  const [camplists, setCamplists] = useState([]);
  const { newList } = useLocalSearchParams();

  const handleAdd = () => {
    router.push("/new-list");
  };

  const purseStorage = async (version: number) => {
    try {
      const camplistKeys = (await AsyncStorage.getAllKeys()).filter((item) =>
        item.startsWith("app-camplist")
      );
      const storedItems = await AsyncStorage.multiGet(camplistKeys);

      const itemsToPurge = storedItems
        .filter(([k, v]) => {
          const camplist: Camplist = JSON.parse(v as string);

          return camplist["version"] == null || camplist["version"] < version;
        })
        .map(([k, v]) => k);

      console.log("items to purge", itemsToPurge);
      await AsyncStorage.multiRemove(itemsToPurge);
    } catch (error) {
      console.log("Error removing checklist items:", error);
    }
  };

  const removeFromStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("Error removing from storage for key ", key, error);
    }
  };

  const removeFromCamplistState = (key) => {
    setCamplists((prevCamplist) => {
      return prevCamplist.filter(([k, v]) => k != key);
    });
  };

  const fetchItemsFromStorage = async (version: number) => {
    try {
      const camplistKeys = (await AsyncStorage.getAllKeys()).filter((item) =>
        item.startsWith("app-camplist")
      );
      const storedItems = await AsyncStorage.multiGet(camplistKeys);

      const keptList = storedItems
        .map(([k, v]) => {
          const cl: Camplist = JSON.parse(v);
          return [k, cl];
        })
        .filter(([k, c]) => {
          return c["version"] != null && c["version"] == version;
        });
      console.log("kept list: ", keptList);
      setCamplists(keptList);
    } catch (error) {
      console.log("Error retrieving checklist items:", error);
    }
  };

  useEffect(() => {
    console.log("initial useEffect triggered (on newList)");
    fetchItemsFromStorage(config.version);

    purseStorage(config.version);
  }, [newList]);

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item }) => {
    const camplist: Camplist = item[1];

    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => {
          router.push({
            pathname: "/list-detail",
            params: {
              cl: JSON.stringify(camplist), // this works as string
              cl_obj: camplist, // this doesn't work, object values become undefined
              obj: { some: "random object" }, // this doesn't work, object values become undefined
              setCamplistFunc: setCamplists,
            },
          });
        }}
      >
        <Text style={styles.inventoryName}>{camplist["name"]}</Text>

        <TouchableOpacity
          onPress={() => {
            console.log("delete item: ", item[0]);
            removeFromStorage(item[0]);
            removeFromCamplistState(item[0]);
          }}
        >
          <MaterialCommunityIcons
            name="delete-forever-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
        <FlatList
          data={camplists}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.flatlistContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyView}>
              <Link href="/new-list">
                <Text style={styles.emptyText}>List Empty, Click to browse items</Text></Link>
            </View>
          )}
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
  emptyView: {
    alignItems: 'center',
  },
  emptyText: {
    color: '#007AFF', // default ios button text color
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
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "grey",
  },
});
export default mylist;
