import React, { useState, useContext } from 'react';
import { StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements'
import UserForm from '../component/UserForm';
import firebase from 'firebase';
import 'firebase/firestore';
import { Context } from '../context/AuthProvider';


const SignUpScreen = ({ navigation, route }) => {
    const { name, weight, heFeet, heInches, date } = route.params;
    const { state, signup, showErr } = useContext(Context);


    const registerUser = ({ email, password }) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
            let user = userCredential.user;
            // console.log(user);
            firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).set({
                name,
                weight,
                heFeet,
                heInches,
                date,
                email,
                password
            }).then(() => {
                signup({ email, userid: firebase.auth().currentUser.uid });
            }).catch((err) => {
                console.log(err);
                showErr(err.message);
            })
        }).catch((err) => {
            console.log(err);
            showErr(err.message);
        })
    }

    return (
        <>
            <Text style={styles.first} >Create New account</Text>
            <UserForm onPost={registerUser} bname="Sign Up" />
            {state.errorMessage ? <Text style={StyleSheet.next}>  Something went wrong</Text> : null}
            <TouchableOpacity onPress={() => navigation.navigate('UserDetail') }>
              <Text style={styles.lastElement}>Create a new Account?  Sign up</Text>
          </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    first: {
        paddingTop: 200,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 30
    },
    next: {
        color: '#FF0000'
    },
    lastElement: {
        textAlign: 'center',
        margin: 10,
        color: 'grey'
    }
});

export default SignUpScreen;
