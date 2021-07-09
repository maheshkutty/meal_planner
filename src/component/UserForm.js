import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';


const UserForm = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Input placeholder="Email" label="Email" onChangeText={setEmail} leftIcon={
                <MaterialIcons name="email" size={24} color="black" />
            } />
            <Input placeholder="Password" label="Password" onChangeText={setPassword} leftIcon={
                <MaterialCommunityIcons name="account-key" size={24} color="black" />
            } />
            <Button title="Sign Up" onPress={() => onSubmit({ email, password })} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    }
});

export default UserForm;