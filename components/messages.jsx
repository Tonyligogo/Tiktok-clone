import { View, Text, TouchableOpacity, TextInput, FlatList, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function({messages, addMessage, headerText}) {
    const [text, setText] = useState('')
    
  return (
    <KeyboardAvoidingView 
    style={{flex:1}}
    // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{padding:8, backgroundColor:'black', flex:1}}>
      <Text style={{color:'white', marginBlock:16, fontSize:28, textAlign:'center', fontWeight:700}}>{headerText}</Text>
      <FlatList
      data={messages}
      style={{marginInline:8, marginTop:20}}
      renderItem={({item})=>{
        return(
          <View style={{marginBlockEnd:16}}>
            <View style={{flexDirection:'row', gap:8}}>
            <Image
            source={{uri:`${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${item?.User.id}/avatar.jpeg` || 'https://placehold.co/40x40'}}
            style={{width:40, height:40,backgroundColor:'white' ,borderRadius:50}}
            />
            <View>
            <Text style={{fontSize:20, color:'gray'}}>{item.User.username}</Text>
            <Text style={{fontSize:18, color:'white'}}>{item.text}</Text>
            </View>
            </View>
          </View>
        )
      }}
      />
      <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
      <TextInput
      placeholder='Type something...'
      style={{flex:1, backgroundColor:'white', padding:10, borderRadius:6 }}
      onChangeText={(text)=>setText(text)}
      value={text}
      />
      <TouchableOpacity onPress={()=>{
          setText('')
          Keyboard.dismiss()
          addMessage(text)
      }}>
      <Ionicons name="send-sharp" size={30} color="white" />
      </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}