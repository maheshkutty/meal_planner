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
            <Text style={styles.firstText}>Welcome</Text>
             <Text style={styles.secondText}>Sign in to continue</Text>  
            <UserForm onPost={onSignIn} bname= "Sign In" />
            {state.errorMessage ? <Text style color= "#FF0000" >   Something went wrong</Text> : null}
            <TouchableOpacity onPress={() => navigation.navigate('UserDetail') }>
              <Text style={styles.lastElement}>Create a new Account?  Sign up</Text>
          </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    firstText: {
        marginTop: 150,
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30
    },

    secondText: {
        textAlign: 'center',
        marginBottom: 35,
        color: 'grey',
        fontSize: 17
    },
        
    lastElement: {
        textAlign: 'center',
        margin: 10,
        paddingTop: 10,
        color: 'grey',
        fontSize: 13
    }
});

export default SignInScreen;