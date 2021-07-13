import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import UserForm from '../component/UserForm';
import { Context } from '../context/AuthProvider';
import firebase from 'firebase';

const SignInScreen = ({ navigation }) => {
    const { state, signin, showErr } = useContext(Context);
    
    useEffect(() => {
        const backAction = () => {
            navigation.navigate("UserDetail");
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [])

    const onSignIn = ({ email, password }) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                signin({ email, userid: firebase.auth().currentUser.uid });
                console.log(state);
                navigation.navigate('Home');
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                showErr(errorMessage);
            });
    }

    return (
        <>
            <Text style={styles.firstText}>Welcome
                Sign in to continue
            </Text>
            <UserForm onPost={onSignIn} bname="Sign In" />
            {state.errorMessage ? <Text>Something went wrong</Text> : null}
            <Text style={styles.lastElement}>Create a new account
                <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}><Text> Sign Up!!</Text></TouchableOpacity>
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

export default SignInScreen;