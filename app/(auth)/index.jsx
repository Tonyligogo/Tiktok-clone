import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Login = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login page</Text>
      <Link style={styles.text} href='/(auth)/signup'>Signup</Link>
      <Link style={styles.text} href='/(tabs)'>Home</Link>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text:{
        fontSize: 20,
        marginBottom: 20,
    }
})