// Importerer de nødvendige komponenter
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';

//import firebase from 'firebase/compat';
import {useEffect, useState} from "react";

import { getDatabase, ref, child, push, update  } from "firebase/database";

// Med navigation og route i parentes henter man fra react native paramentre, så man kan sendes videre til de forskellige screens afhængigt af ens handlinger.
function AddProduct({navigation,route}){

    // Laver en database
    const db = getDatabase();

    // initalState objekt indeholder de nødvendige string attributer for databasen
    const initialState = {
        Brand: '',
        Description: '',
        Year: '',
        Size: '',
        Price: ''
    }

    // Her laves en ny state
    const [newProduct,setNewProduct] = useState(initialState);

    // Her labes en ny funktion for at kunne redigere produktet
    // Returnerer true, hvis vi er på edit product
    const isEditProduct = route.name === "Edit Product";

    // Funktion med if statement, der henter produkt objekt fra paramentrene
    useEffect(() => {
        if(isEditProduct){
            const product = route.params.product[1];
            setNewProduct(product)
        }
        // Fjerner data, når vi går væk fra screenen
        return () => {
            setNewProduct(initialState)
        };
    }, []);

    // Funktion til at kunne ændre input og tilføje nyt produkt
    const changeTextInput = (name,event) => {
        setNewProduct({...newProduct, [name]: event});
    }

    // Her laves en handleSave funktion
    const handleSave = async () => {

        const { Brand, Description, Year, Size, Price } = newProduct; // Henter newProduct objektets keys

        // Alert hvis nogle af felterne er tomme
        if(Brand.length === 0 || Description.length === 0 || Year.length === 0 || Size.length === 0 || Price.length === 0 ){
            return Alert.alert('Et af felterne er tomme!');
        }

        if(isEditProduct){
            const id = route.params.product[0];

            // Definerer path til den product node, der skal opdateres
            const productRef = ref(db, `Products/${id}`);

            // Definerer de felter, der skal opdateres
            const updatedFields = {
                Brand,
                Description,
                Year,
                Size,
                Price
            };
            
            // Bruges update til at kunne opdaterer ovenstående felter 
            await update(productRef, updatedFields)
                .then(() => {
                Alert.alert("Din info er nu opdateret");
                const product = newProduct
                navigation.navigate("Product Details", { product });
                })
                .catch((error) => {
                console.error(`Error: ${error.message}`);
                });

        }else{

        // Definerer path til products node, hvor den nye data skal "pushes"
        const productsRef = ref(db, "/Products/");
        
        // Data to push
        const newProductData = {
            Brand,
            Description,
            Year,
            Size,
            Price
        };
        
        // Pusher den nye data til products noden
        await push(productsRef, newProductData)
            .then(() => {
            Alert.alert("Saved");
            setNewProduct(initialState);
            })
            .catch((error) => {
            console.error(`Error: ${error.message}`);
            });
    }
    };

    return (
        // SafeAreaView er vores parent, og ScrollView er vores child.
        <SafeAreaView style={styles.container}>
    
            <ScrollView> 
                {
                    // Her laves en objekt keys funktion med parametrene for attributterne
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            // Denne return indeholder styling, tekst komponent og tekst input
                            // Teksts komponentet tager attributterne
                            // Tekst input gør, at vi kan returnere en række felter, som vi skal kunne indtaste og ændre værdier i ved at tage eventet
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{key}</Text>
                                <TextInput
                                    value={newProduct[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                />
                            </View>
                        )
                    })
                }
                {/*Knappen gemmer de nyeste handlinger, og viser save changes i stedet for add product, hvis vi er inde i edit product.*/}
                <Button title={ isEditProduct ? "Save changes" : "Add product"} onPress={() => handleSave()} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default AddProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        width: 100
    },
    input: {
        borderWidth: 1,
        padding:5,
        flex: 1
    },
});