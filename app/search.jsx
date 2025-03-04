import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../utils/supabase';

export default function() {
  const [searchText, setSearchText] = useState('');
  const [people, setPeople] = useState([])
  const router = useRouter();
  const handleSearch = async () => {
    const {data,error} = await supabase
    .from('User')
    .select('*')
    .ilike('username', `%${searchText}%`)
    if(error) return console.log(error)
    setPeople(data)
    Keyboard.dismiss()
  };
  return (
    <SafeAreaView>
      <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', marginTop:10}}>
      <TouchableOpacity onPress={()=>router.back()}>
        <Ionicons name="chevron-back" size={30} color='black' />
      </TouchableOpacity>
      <Text style={{fontWeight:800, fontSize:24}}>Search</Text>
      <Text style={{color:'transparent'}}>Search</Text>
      </View>
      <View style={{flexDirection:'row', alignItems:'center', gap:10, paddingInline:10, marginBlock:16}}>
            <TextInput
            placeholder='Find others'
            style={{flex:1, padding:10, borderWidth:1,borderColor:'gray', borderRadius:6 }}
            onChangeText={(text)=>setSearchText(text)}
            value={searchText}
            />
            <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={30} color="black" />
            </TouchableOpacity>
      </View>
      <FlatList
      data={people}
      style={{paddingInline:10}}
      renderItem={({item:user})=>
        <TouchableOpacity onPress={()=>router.push(`/user?user_id=${user?.id}`)}>
        <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
          <Image
            source={{uri:`${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${user?.id}/avatar.jpeg` || 'https://placehold.co/40x40'}}
            style={{width:40, height:40,backgroundColor:'gray' ,borderRadius:50}}
            />
          <Text style={{fontSize:18}}>{user?.username}</Text>
        </View>
        </TouchableOpacity>
      }
      />
    </SafeAreaView>
  );
}
