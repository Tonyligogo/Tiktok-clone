import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { Link } from 'expo-router'
import { useAuth } from '../../providers/AuthProvider'

const Login = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const {signIn} = useAuth()

  return (
    <View style={styles.container}>
      <Text style={{fontSize:36, fontWeight:'bold', marginBottom:20}}>Login</Text>
      <TextInput
      placeholder='Email'
      style={styles.input}
      value={email}
      onChangeText={setEmail}
      />
      <TextInput
      placeholder='Password'
      secureTextEntry={true}
      style={styles.input}
      value={password}
      onChangeText={setPassword}
      />
      <TouchableOpacity 
      onPress={() => signIn(email, password)} 
      style={styles.loginBtn}
      >
        <Text style={{color:'white', fontWeight:'bold', fontSize:20, textAlign:'center'}}>Login</Text>
      </TouchableOpacity>
      <Link style={styles.link} href='/(auth)/signup'>Don&apos;t have an account? Signup</Link>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding:20,
    },
    loginBtn:{
        backgroundColor:'black',
        borderRadius:8,
        paddingBlock:16,
        marginTop:10,
        width:'100%'
    },
    input:{
      backgroundColor:'transparent',
      marginBottom:12,
      padding:12,
      borderWidth:1,
      borderColor:'gray',
      borderRadius:8,
      width:'100%',
      fontSize:18,
    },
    link:{
      color:'blue',
      textDecorationLine:'underline',
      marginTop:20,
    }
})