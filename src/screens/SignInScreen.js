import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import UserForm from '../component/UserForm';


const SignInScreen = ({ navigation }) => {
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
    
    return (
        <>
            <Text style={styles.firstText}>Welcome
                Sign in to continue
            </Text>
            <UserForm />
            <Text style={styles.lastElement}>Create a new account
                <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}><Text> Sign In!!</Text></TouchableOpacity>
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