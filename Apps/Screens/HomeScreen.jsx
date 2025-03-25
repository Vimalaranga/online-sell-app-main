import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Components/HomeScreen/Header";
import Slider from "./Components/HomeScreen/Slider";
import Categories from "./Components/HomeScreen/Categories";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import PostItem from "./Components/HomeScreen/postItem";

export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  /*slider*/
  const getSliders = async () => {
    const querySnapshot = await getDocs(collection(db, "slider"));
    const sliders = querySnapshot.docs.map((doc) => doc.data());
    setSliderList(sliders);
  };

  /*categorylist*/
  const getCategoryList = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const categories = querySnapshot.docs.map((doc) => doc.data());
    setCategoryList(categories);
  };

  /*itemlist*/
  const getLatestItemList = async () => {
    const querySnapshot = await getDocs(collection(db, "userPost"));
    const items = querySnapshot.docs.map((doc) => doc.data());
    setLatestItemList(items);
  };

  const renderHeader = () => (
    <View>
      <Header />
      <Slider sliderList={sliderList} />
      <Categories categoryList={categoryList} />
    </View>
  );

  return (
    <FlatList
      className="py-8 px-6 bg-white flex-1"
      ListHeaderComponent={renderHeader}
      data={latestItemList}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      renderItem={({ item }) => <PostItem item={item} />}
    />
  );
}
