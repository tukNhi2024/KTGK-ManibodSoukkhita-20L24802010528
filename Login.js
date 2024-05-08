import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, TextInput, HelperText} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store';

const Login = ({navigation}) => {
  const store = useContext(StoreContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);

  const onChangeButton = () => {
    if (email.includes('@') && password.length >= 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const onPress = () => {
    firestore()
      .collection('Users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);

        if (querySnapshot.size === 0) {
          setError(true);
          return;
        }

        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );

          store.login(documentSnapshot.data());
          navigation.navigate('Home');
        });
      })
      .catch(error => {
        console.error('Error getting users: ', error);
      });
  };

  useEffect(() => {
    onChangeButton();
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Avatar.Image size={160} source={require('../img/firebase.jpg')} />
      <TextInput
        style={{...styles.input, marginTop: 32}}
        label={'E-mail'}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        label={'Password'}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {error && <HelperText type="error">Login fail!</HelperText>}
      <Button
        style={{
          ...styles.input,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        labelStyle={{fontSize: 16}}
        mode={'contained'}
        onPress={() => onPress()}
        disabled={disabled}>
        Login
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Don't have an account?</Text>
        <Button onPress={() => navigation.navigate('Register')}>Sign up</Button>
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

export default Login;
