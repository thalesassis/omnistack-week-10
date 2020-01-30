import React from 'react';
import { StyleSheet, StatusBar, Text, View } from 'react-native';

import Routes from './routes';

export default function App() {
  return (
    <> 
    <StatusBar barStyle="light-content" backgroundColor="#FF0000" />
    <Routes />
    </>
  ); 
}