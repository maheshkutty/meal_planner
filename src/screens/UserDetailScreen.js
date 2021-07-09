import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [heFeet, setheFeet] = useState('');
    const [heInches, setheInches] = useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const getDateFormat = () => {
        let result = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return result;
    }

    return (
        <ScrollView style={styles.conatiner}>
            <Text>Create New account</Text>
            <Input label="Name" placeholder="Name" onChangeText={setName} />
            <Input label="Weight" placeholder="Weight" onChangeText={setWeight} rightIcon={
                <Text>KG</Text>
            } />
            <TouchableOpacity onPress={showDatepicker}>
                <Input label="DOB" placeholder="DOB" disabled={true} value={getDateFormat()} />
            </TouchableOpacity>
            {show && (
                <DateTimePicker testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange} />
            )}
            <View style={styles.heightWeightStyle}>
                <Input label="Height" placeholder="Height" onChangeText={setheFeet} rightIcon={
                    <Text>Ft</Text>
                } />
                <Input label="Inches" placeholder="Inches" onChangeText={setheInches} rightIcon={
                    <Text>IN</Text>
                } />
            </View>
            <View style={styles.nextIcon}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Signup", { name, weight, heFeet, heInches, date: getDateFormat() })
                    } activeOpacity={0.6}>
                    <MaterialIcons name="navigate-next" size={50} color="black" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        marginTop: 50
    },
    heightWeightStyle: {
        flexDirection: 'column'
    },
    nextIcon: {
        alignItems: 'flex-end'
    },
    dateStyle: {
        borderBottomWidth: 1,
        margin: 2,
        marginBottom: 5,
        fontSize: 15
    }
})

export default SignUpScreen;
