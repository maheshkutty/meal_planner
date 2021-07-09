import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from 'react-native-elements'
import UserForm from '../component/UserForm';
import firebase from 'firebase';
import 'firebase/firestore';


const SignUpScreen = ({ navigation, route }) => {
    const { name, weight, heFeet, heInches, date } = route.params;
    const [user, setUser] = useState(null);

    console.log(name);

    const registerUser = ({ email, password }) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
            let user = userCredential.user;
            console.log(user);
            firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).set({
                name,
                weight, 
                heFeet,
                heInches, 
                date, 
                email, 
                password
            }).then((docref) => {
                console.log(`Document written ${docref}`);
            }).catch((err) => {
                console.log(err);
            })
            //setUser(user);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
            <Text style={styles.firstText}>Create New account</Text>
            <UserForm onSubmit={registerUser} />
            <Text style={styles.lastElement}>Already have a account
                <Pressable onPress={() => navigation.navigate("SignIn")}><Text> Sign In!!</Text></Pressable>
            </Text>
        </>
    )
}

const styles = StyleSheet.create({
    firstText: {
        marginTop: 200,
        marginBottom: 20
    },
    lastElement: {
        textAlign: 'center',
        margin: 10
    }
});

export default SignUpScreen;
