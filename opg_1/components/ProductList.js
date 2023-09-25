// Importerer de nødvendige komponenter
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

//import firebase from 'firebase/compat';
import {useEffect, useState} from "react";

import { getDatabase, ref, onValue } from "firebase/database";

// Med navigation i parentes henter man fra react native paramentre, så man kan sendes videre til de forskellige screens afhængigt af ens handlinger.
function ProductList({navigation}){

    // Her laves en state
    const [products,setProducts] = useState()

    /*
    useEffect(() => {
        // If statement for at kontrollere at der ikke er
        if(!products) {
            firebase
                .database()
                .ref('/Products')
                .on('value', snapshot => {
                    setProducts(snapshot.val())
                });
        }
    },[]);*/
    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, "Products");
    
        // Bruger 'onValue' funktion for at lytte til om der er ændringer i 'Products' node
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // If data exists, set it in the 'products' state
                setProducts(data);
            }
        });
    
        // Clean up the listener when the component unmounts
        return () => {
            // Unsubscribe the listener
            off(productsRef);
        };
    }, []); // Tomt array betyder at denne effekt kun kører 1 gang. 


    // If statement for at kontrollere, at der ikke er nogle produkter. Vi viser ingenting, hvis der ikke er data
    if (!products) {
        return <Text>Loading...</Text>;
    }

    // Funktion søger i array for at finde det objekt som matcher og ligger det ned i vores paramentre i navigation
    const handleSelectProduct = id => {
        const product = Object.entries(products).find( product => product[0] === id /*id*/)
        navigation.navigate('Product Details', { product });
    };
    
    // Her laves const variablerne før return
    // Flatlist forventer et array --> tager derfor alle values fra vores products objekt og bruger som array til listen
    const productArray = Object.values(products);
    const productKeys = Object.keys(products);

    return (
        <FlatList
            data={productArray}

            // Keys til at finde ID på aktuelle produkt og returnerer dette som key, og giver det med som ID til ProductListItem
            keyExtractor={(item, index) => productKeys[index]}
            renderItem={({ item, index }) => {
                return(
                    <TouchableOpacity style={styles.container} onPress={() => handleSelectProduct(productKeys[index])}>
                        <Text>
                            {item.Brand}, {item.Description}
                        </Text>
                    </TouchableOpacity>
                )
            }}
        />
    );
}

export default ProductList;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        margin: 5,
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: { fontWeight: 'bold' },
});