import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider"

export default function InboxScreen() {
  const {user} = useAuth()
  const [activity, setActivity] = useState([])

  const getComments = async () => {
    const {data, error} = await supabase
    .from('Comment')
    .select('*, User(*)')
    .eq('video_user_id', user.id)
    .order('created_at',{ascending: false})
    .limit(10)
    if(error) return console.log(error)
    getLikes(data)
  }

  const getLikes = async (comments) => {
    const {data, error} = await supabase
    .from('Like')
    .select('*, User(*)')
    .eq('video_user_id', user.id)
    .order('created_at',{ascending: false})
    .limit(10)
    if(error) return console.log(error)
    setActivity(comments.concat(data))
  }
  useEffect(()=>{
    getComments()
  },[])

  return (
    <SafeAreaView style={{backgroundColor:'black', flex:1}}>
      <Header title="Activity" color='white' goBack />
      <FlatList
        data={activity}
        style={{paddingInline:10, marginTop:20}}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: "row", gap:8, marginBottom:16}}
          >
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${item.User?.id}/avatar.jpeg` || 'https://placehold.co/40x40' }}
              style={{
                width: 40,
                height: 40,
                backgroundColor: "white",
                borderRadius: 50,
              }}
            />
            <View>
              <Text style={{ fontSize: 20, color: "white" }}>
                {item.User.username}
              </Text>
              <Text style={{ fontSize: 17, color:'white' }}>{item.text || 'Liked your video'}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
