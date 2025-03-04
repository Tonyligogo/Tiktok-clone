import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../utils/supabase";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode, Video } from "expo-av";


export default function ({user, following, followers}) {
  const { user:authUser, signOut, following:myFollowing, getFollowing } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState([]);
  const videoRef = useRef(null);
  useEffect(()=>{
    getVideos()
    getLikes()
  },[user])

  const getVideos = async () => {
    const {data} = await supabase
    .from('Video')
    .select('*, User(*)')
    .eq('user_id', user?.id)
    .order('created_at', {ascending: false})
    getSignedUrls(data)
  }
  const getLikes = async () => {
    const { data, error } = await supabase
      .from("Like")
      .select("*")
     .eq("video_user_id", user?.id);
    if (error) return console.error(error);
    setLikes(data);
  }
  const getSignedUrls = async(videos)=>{
    const {data} = await supabase.storage
    .from('videos')
    .createSignedUrls(videos.map((video)=>video.url), 60 * 60 * 24 * 7)
    let videoUrls = videos?.map((item)=>{
      item.signedUrl = data?.find((signedUrl)=>signedUrl.path === item.url)?.signedUrl
      return item
    })
    setVideos(videoUrls)
  }
  const addProfilePicture = async () => {
    if(authUser?.id !== user?.id) return
     let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images", "videos"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setProfilePicture(result.assets[0].uri);
        }
        saveImage(result.assets[0].uri)
  }
  const followUser = async () => {
    const { error } = await supabase.from("Follower").insert({
      user_id: authUser?.id,
      follower_user_id: user?.id,
    });
    if (!error) getFollowing(user?.id);
  };
  const unFollowUser = async () => {
    const { error } = await supabase
      .from("Follower")
      .delete()
      .eq("user_id", authUser?.id)
      .eq("follower_user_id", user?.id);
    if (!error) getFollowing(user?.id);
  };
  const saveImage = async (uri) => {
    const formData = new FormData();
    const fileName = uri?.split("/").pop();
    const extension = fileName?.split(".").pop();
    formData.append("file", {
      uri: uri,
      type: `image/${extension}`,
      name: `avatar.${extension}`,
    });
    const { data, error } = await supabase.storage
      .from(`avatars/${user?.id}`)
      .upload(`avatar.${extension}`, formData, {
        cacheControl: "3600000000",
        upsert: true,
      });
      if (error) console.error('avatar storage error',error);
      setProfilePicture(data?.fullPath)
  };
  return (
    <SafeAreaView style={{backgroundColor:'black', flex:1}}>
      <TouchableOpacity onPress={addProfilePicture} style={{marginTop:20, marginInline:'auto'}}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${user?.id}/avatar.jpeg` || 'https://placehold.co/40x40' }}
          style={{
            width: 60,
            height: 60,
            backgroundColor: "white",
            borderRadius: 50,
          }}
        />
      </TouchableOpacity>
      <Text style={{textAlign:'center', fontSize:18, marginTop:5, color:'white'}}>@{user?.username}</Text>
      <View style={{marginTop:20, flexDirection:'row', justifyContent:'space-evenly'}}>
        <View>
          <Text style={{fontSize:18, color:'white'}}>Following</Text>
          <Text style={{textAlign:'center', color:'white'}}>{following?.length}</Text>
        </View>
        <View>
          <Text style={{fontSize:18, color:'white'}}>Followers</Text>
          <Text style={{textAlign:'center', color:'white'}}>{followers?.length}</Text>
        </View>
        <View>
          <Text style={{fontSize:18, color:'white'}}>Likes</Text>
          <Text style={{textAlign:'center', color:'white'}}>{likes?.length}</Text>
        </View>
      </View>
      {authUser?.id === user?.id ? 
      <TouchableOpacity style={{marginInline:'auto', marginBlockStart:30, backgroundColor:'white', paddingBlock:10, paddingInline:24, borderRadius:4}} onPress={() => signOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      :
      <View style={{alignItems:'center', marginBlockStart:30}}>
        {myFollowing?.filter((u) => u?.follower_user_id === user?.id).length > 0 ? 
        (
                <TouchableOpacity style={{backgroundColor:'white', paddingBlock:10, paddingInline:24, borderRadius:4}} onPress={unFollowUser}>
                  <Text>Unfollow</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{backgroundColor:'white', paddingBlock:10, paddingInline:24, borderRadius:4}} onPress={followUser}>
                  <Text>Follow</Text>
                </TouchableOpacity>
              )}
      </View>
      }
      <FlatList
      numColumns={3}
      data={videos}
      style={{marginTop:20}}
      renderItem={({item})=>
        <Video
        ref={videoRef}
        style={{
          width: Dimensions.get("window").width*.333,
          height: 220,
          borderColor:'gray',
          borderWidth:1
        }}
        source={{
          uri: item?.signedUrl,
        }}
        resizeMode={ResizeMode.COVER}
        isLooping
      />
      }
      />
    </SafeAreaView>
  );
}
