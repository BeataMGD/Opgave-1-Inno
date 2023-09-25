// Importerer de nødvendige komponenter
import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApps, initializeApp } from "firebase/app";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import AddProduct from './components/AddProduct';
import ProductDetails from './components/ProductDetails';
import ProductList from './components/ProductList';

import Ionicons from "react-native-vector-icons/Ionicons";


export default function App() {

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD7jX9A5DEty0lrVubHc4gF9hEDn2qJRcQ",
    authDomain: "react-3830e.firebaseapp.com",
    databaseURL: "https://react-3830e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-3830e",
    storageBucket: "react-3830e.appspot.com",
    messagingSenderId: "451100656853",
    appId: "1:451100656853:web:c1b851f818c674f1d60e5c"
  };

  // Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
  // Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
    console.log("Firebase On!");

    // Initialiserer Stack navigatoren og Botton navigatoren
  }
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  // Funktion der returnerer 3 screens med name og component
  const StackNavigation = () => {
    return(
        <Stack.Navigator>
          <Stack.Screen name={'Product List'} component={ProductList}/>
          <Stack.Screen name={'Product Details'} component={ProductDetails}/>
          <Stack.Screen name={'Edit Product'} component={AddProduct}/>
        </Stack.Navigator>
    )
  }

  return (
    // Container til at wrappe alle Tab navigatorer
    // StackNavigation er til hjemme-knappen, og AddProduct er til at tilføje produkter
    // Et ikon er tilføjet, som man kan trykke på for at navigere sig igennem de to funktioner.
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={'Home'} component={StackNavigation} options={{tabBarIcon: () => ( <Ionicons name="home" size={20} />),headerShown:null}}/>
        <Tab.Screen name={'Add'} component={AddProduct} options={{tabBarIcon: () => ( <Ionicons name="add" size={20} />)}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});