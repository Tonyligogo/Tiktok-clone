import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Signup = () => {
  return (
    <View>
      <Text>Signup</Text>
      <Link href='/(auth)'>Login</Link>
    </View>
  )
}

export default Signup