import React from 'react';
import {StoreProvider} from '../store';
import { firebase } from '@react-native-firebase/firestore';
import auth from  '@react-native-firebase/auth';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Root from "./navigations/Root";

const App = () => {
  const USERS = firestore().collection("USERS")
  const admin = {
    fullName: "Admin",
    email: " touk.13.ta@gmail.com",
    password: " 123456",
    phone: "0912885220",
    role: "admin"
  }
  useEffect(()=>{
    USERS.doc(admin.email)
    .onSnapshot(
      u=>{
        if(!u.existe)
        {
          auth().createUserWithEmailAndPassword(admin.email, admin.password)
          .then(Response =>
          {
            USERS.doc(admin.email).set(admin)
            console.log("Add new account admin")
          }
        )
        }
      }
    )
  }
, [])
 return (
  <StoreProvider>
    <NavigationContainer>
      <Root/>
    </NavigationContainer>
  </StoreProvider>
 )
}