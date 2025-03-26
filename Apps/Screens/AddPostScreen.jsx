import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddPostScreen() {
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = querySnapshot.docs.map(doc => doc.data());
    setCategoryList(categories);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Upload image
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `posts/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Create post document
      const postData = {
        ...value,
        userId: user.uid,
        image: downloadURL,
        createdAt: Date.now(),
      };
      
      await addDoc(collection(db, "userPost"), postData);
      Alert.alert("Success", "Post created successfully!");
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create New Post</Text>
        <Text style={styles.subtitle}>Share your item with the community</Text>

        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
          }}
          onSubmit={onSubmitMethod}
          validate={values => {
            const errors = {};
            if (!values.title) errors.title = "Title is required";
            if (!values.desc) errors.desc = "Description is required";
            if (!values.price) errors.price = "Price is required";
            if (!values.category) errors.category = "Category is required";
            if (!image) errors.image = "Image is required";
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
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Image Upload */}
              <TouchableOpacity 
                style={styles.imageUploadContainer}
                onPress={pickImage}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialIcons name="add-a-photo" size={32} color="#666" />
                    <Text style={styles.uploadText}>Tap to upload photo</Text>
                  </View>
                )}
                {errors.image && touched.image && (
                  <Text style={styles.errorText}>{errors.image}</Text>
                )}
              </TouchableOpacity>

              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item title"
                  placeholderTextColor="#999"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                />
                {errors.title && touched.title && (
                  <Text style={styles.errorText}>{errors.title}</Text>
                )}
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Describe your item..."
                  placeholderTextColor="#999"
                  value={values.desc}
                  onChangeText={handleChange("desc")}
                  onBlur={handleBlur("desc")}
                  multiline
                  numberOfLines={4}
                />
                {errors.desc && touched.desc && (
                  <Text style={styles.errorText}>{errors.desc}</Text>
                )}
              </View>

              {/* Price Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  placeholderTextColor="#999"
                  value={values.price}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  keyboardType="decimal-pad"
                />
                {errors.price && touched.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              {/* Category Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={values.category}
                    onValueChange={itemValue => setFieldValue("category", itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {categoryList.map((item, index) => (
                      <Picker.Item key={index} label={item.name} value={item.name} />
                    ))}
                  </Picker>
                </View>
                {errors.category && touched.category && (
                  <Text style={styles.errorText}>{errors.category}</Text>
                )}
              </View>

              {/* Location Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item location"
                  placeholderTextColor="#999"
                  value={values.address}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Publish Listing</Text>
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
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageUploadContainer: {
    marginBottom: 24,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  uploadPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#2d3436",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: "#2d3436",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  picker: {
    height: 50,
    color: "#2d3436",
  },
  button: {
    backgroundColor: "#00a896",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#e63946",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
});