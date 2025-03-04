import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";

export default function InboxScreen() {
  const router = useRouter();
  const {friends} = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [friends]);

  const getUsers = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
     .in('id', friends)
     if (error) return console.log(error)
    setUsers(data)
  }
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'black'}}>
      <Text style={{ fontSize:28, textAlign:'center', marginBlock:10, fontWeight: 800, color:'white' }}>Inbox</Text>
      <TouchableOpacity onPress={() => router.push('/followers')} style={{ flexDirection: "row", justifyContent:'space-between', gap:8, paddingInline:8 }}>
        <View style={{flexDirection:'row', gap:8}}>
          <View style={{backgroundColor:'#69C9D0', width:36, height:36, borderRadius:50, alignItems:'center',justifyContent:'center'}}>
          <Ionicons name='people' size={24} color='white' />
          </View>
        <View>
          <Text style={{ fontSize: 20, color:'white'}}>New followers</Text>
          <Text style={{ fontSize: 17, color: "white" }}>Say hi</Text>
        </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/activity')} style={{ flexDirection: "row", justifyContent:'space-between', gap:8,marginBlock:16, paddingInline:8 }}>
        <View style={{flexDirection:'row', gap:8}}>
          <View style={{width:36, height:36, borderRadius:50, backgroundColor:'#EE1D52', alignItems:'center',justifyContent:'center'}}>
          <Ionicons name='time' size={24} color='white' />
          </View>
        <View>
          <Text style={{ fontSize: 20, color:'white'}}>Activity</Text>
          <Text style={{ fontSize: 17, color: "white" }}>See what people are doing</Text>
        </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="gray" />
      </TouchableOpacity>
      <FlatList
              data={users}
              style={{paddingInline:8, marginTop:10}}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/chat?chat_user_id=${item.id}`)}
                  style={{ flexDirection: "row", gap: 8 }}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${item?.id}/avatar.jpeg` || 'https://placehold.co/40x40' }}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "white",
                      borderRadius: 50,
                    }}
                  />
                  <View>
                    <Text style={{ fontSize: 20, color: "white" }}>
                      {item.username}
                    </Text>
                    <Text style={{ fontSize: 17, color:'#efefef' }}>Say hi</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
    </SafeAreaView>
  );
}
