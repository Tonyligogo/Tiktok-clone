import { View, Text, TouchableOpacity, TextInput, FlatList, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useAuth } from '../providers/AuthProvider'
import { useLocalSearchParams } from 'expo-router'
import { supabase } from '../utils/supabase'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function() {
    const {user} = useAuth()
    const params = useLocalSearchParams()
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    useEffect(()=>{
      getComments()
    },[])
    const getComments = async()=>{
      const{data, error} = await supabase
      .from('Comment')
      .select('*, User(*)')
      .eq('video_id', params.video_id)
      if(error) return console.log(error)
      setComments(data)
    }
    const addComment = async()=>{
      const{error} = await supabase.from('Comment').insert({
        user_id:user.id,
        video_id:params.video_id,
        text:commentText
      })
      if(error) return console.log(error)
      setCommentText('')
      Keyboard.dismiss()
      getComments()
    }
  return (
    <KeyboardAvoidingView 
    style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{margin:8, flex:1}}>
      <Text style={{fontWeight:600, fontSize:24, marginBottom:16,textAlign:'center'}}>Comments</Text>
      <FlatList
      data={comments}
      style={{margin:8}}
      renderItem={({item})=>{
        return(
          <View style={{marginBlockEnd:16}}>
            <View style={{flexDirection:'row', gap:8}}>
            <Image
            source={{uri:'https://placehold.co/40x40'}}
            style={{width:40, height:40,backgroundColor:'black' ,borderRadius:50}}
            />
            <View>
            <Text style={{fontSize:18, color:'gray'}}>{item.User.username}</Text>
            <Text style={{fontSize:20}}>{item.text}</Text>
            </View>
            </View>
          </View>
        )
      }}
      />
      <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
      <TextInput
      placeholder='Write a comment...'
      style={{flex:1, padding:10, borderWidth:1,borderColor:'gray', borderRadius:6 }}
      onChangeText={(text)=>setCommentText(text)}
      value={commentText}
      />
      <TouchableOpacity onPress={addComment}>
      <Ionicons name="send-sharp" size={30} color="black" />
      </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}