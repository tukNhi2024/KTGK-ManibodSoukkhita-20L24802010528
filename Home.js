import React, {useContext, useEffect, useState} from 'react';
import {FlatList, View, Text} from 'react-native';
import {StoreContext} from '../store';
import {Appbar, Button, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const Home = ({navigation}) => {
  const store = useContext(StoreContext);
  const [newEntity, setNewEntity] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState([]);

  const onChangeButton = () => {
    if (newEntity !== '') {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const onPress = () => {
    firestore()
      .collection('Jobs')
      .add({
        name: newEntity,
      })
      .then(() => {
        console.log('Jobs added!');
      });
  };

  useEffect(() => {
    // console.log(store.user);
    onChangeButton();

    firestore()
      .collection('Jobs')
      .onSnapshot(querySnapshot => {
        console.log('Total Jobs: ', querySnapshot.size);

        let jobs = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log('Job ID: ', documentSnapshot.id, documentSnapshot.data());
          jobs.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });

        setData(jobs);
      });
  }, [newEntity]);

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={store.user.fullName} />
        <Appbar.Action
          icon="logout"
          onPress={() => {
            store.logout();
            navigation.navigate('Login');
          }}
        />
      </Appbar.Header>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}>
        <TextInput
          label="New entity"
          style={{width: '70%', height: 48}}
          value={newEntity}
          onChangeText={text => setNewEntity(text)}
        />
        <Button
          mode="contained"
          style={{
            width: '20%',
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
          }}
          disabled={disabled}
          onPress={() => onPress()}>
          Add
        </Button>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <Text
              style={{
                fontSize: 20,
                padding: 16,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                fontWeight: 'bold',
              }}>
              {item.name}
            </Text>
          );
        }}
      />
    </View>
  );
};

export default Home;
