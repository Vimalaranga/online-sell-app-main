import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  image,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { getAuth } from "firebase/auth";

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();

  const auth = getAuth(app);

  const [Loading, setLoading] = useState(false);

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const onSubmitMethod = async (value) => {
    setLoading(true);
    // Get the current user ID
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    // Include the user ID in the form values
    value.userId = userId;
    //convert url o blob file
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, "addsphotos/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (getDownloadURL) => {
          console.log(getDownloadURL);
          value.image = getDownloadURL;

          const docRef = await addDoc(collection(db, "userPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("Success!!!", "Post Added Successffully.");
          }
        });
      });
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Post</Text>
        <Text style={styles.subtitle}>Create New Post and Start Selling</Text>
        <Formik
          initialValues={{
            name: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            createdAt: Date.now(),
          }}
          onSubmit={(value) => onSubmitMethod(value)}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              console.log("Title not present");
              ToastAndroid.show("Title Must be there", ToastAndroid.SHORT);
              errors.name = "Title Must be there";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                ) : (
                  <Image
                    source={require("./../../assets/images/placeholder.jpg")}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={values?.address}
                onChangeText={handleChange("address")}
              />
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 10 }}>
                <Picker
                  selectedValue={values?.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                >
                  {categoryList &&
                    categoryList.map((Item, index) => (
                      <Picker.Item
                        key={index}
                        label={Item.name}
                        value={Item.name}
                      />
                    ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: Loading ? "#ccc" : "#ff4500" },
                ]}
                onPress={handleSubmit}
                disabled={Loading}
              >
                {Loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40, // Equivalent to "p-10" in Tailwind CSS
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 17,
    textAlignVertical: "top",
  },

  button: {
    padding: 15,
    backgroundColor: "#ff4500", // Blue color
    borderRadius: 999, // Rounded-full equivalent
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
});
