import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

export default function Animation() {
    return (
      <View>
        <LottieView
          source={require('./Loading.json')}
          autoPlay
          loop
          style={styles.loading}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loading: {
      width: 100,
      height: 100,
    },
  });