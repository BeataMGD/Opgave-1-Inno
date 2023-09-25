// Importerer de nødvendige komponenter
import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';

//import firebase from 'firebase/compat';
import {useEffect, useState} from "react";

import { getDatabase, ref, remove } from "firebase/database";

// Med navigation og route i parentes henter man fra react native paramentre, så man kan sendes videre til de forskellige screens afhængigt af ens handlinger.
function ProductDetails ({route,navigation}){

    // Her laves en state for product med useState
    const [product,setProduct] = useState({});

    useEffect(() => {
        
        // Her henter vi produkt values og sætter dem
        setProduct(route.params.product[1]);

        // Når vi forlader screen, tømmes objektet
        return () => {
            setProduct({})
        }
    });

    // Funktion henter objektet, hvor vi navigerer til Edit Product ved at sende produktet med videre.
    const handleEdit = () => {
        const product = route.params.product
        navigation.navigate('Edit Product', { product });
    };

    // confirmDelete bruges til, at brugeren kan bekræfte handlingen.
    const confirmDelete = () => {

        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the product?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    };

    // Funktion henter id fra route og laver en try-catch 
    const handleDelete = async () => {
        const id = route.params.product[0];
        const db = getDatabase();

        // Definerer pathen til produkt noden, som skal slettes
        const productRef = ref(db, `Products/${id}`);
        
        // Remove bruges til at fjerne produkt noden
       await remove(productRef)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    // If statemnt til når der ikke er et produkt
    if (!product) {
        return <Text>No data</Text>;
    }

    // Her laves knapperne
    return (
        <View style={styles.container}>
            <Button title="Edit" onPress={ () => handleEdit()} />
            <Button title="Delete" onPress={() => confirmDelete()} />
            {
                Object.entries(product).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {/*Vores product keys navn*/}
                            <Text style={styles.label}>{item[0]} </Text>
                            {/*Vores product values navne */}
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    )
                })
            }
        </View>
    );
}

export default ProductDetails;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});