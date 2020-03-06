import React from 'react';
import { View } from 'react-native';

function User({ navigation }) {
  console.tron.log(navigation.getParam('user'));
  return <View />;
}

export default User;
