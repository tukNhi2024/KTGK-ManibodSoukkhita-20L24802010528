import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Register = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(true);

  const onChangeButton = () => {
    if (
      email.includes('@') &&
      fullName !== '' &&
      password.length >= 6 &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const onPress = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');

        firestore()
          .collection('Users')
          .add({
            fullName: fullName,
            email: email,
            password: password,
          })
          .then(() => {
            console.log('User added!');
            navigation.navigate('Login');
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  useEffect(() => {
    onChangeButton();
  }, [email, password, confirmPassword, fullName]);

  return (
    <View style={styles.container}>
      <Avatar.Image size={160} source={require('../img/firebase.jpg')} />
      <TextInput
        style={{...styles.input, marginTop: 32}}
        label={'Full name'}
        value={fullName}
        onChangeText={text => {
          setFullName(text);
        }}
      />
      <TextInput
        style={styles.input}
        label={'E-mail'}
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        style={styles.input}
        label={'Password'}
        value={password}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <TextInput
        style={styles.input}
        label={'Confirm Password'}
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
        }}
      />
      <Button
        style={{
          ...styles.input,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        labelStyle={{fontSize: 16}}
        mode={'contained'}
        disabled={disabled}
        onPress={() => onPress()}>
        Register
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Already got an account?</Text>
        <Button onPress={() => navigation.goBack()}>Login</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    margin: 10,
    height: 48,
  },
});

export default Register;
