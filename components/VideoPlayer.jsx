import { Video, ResizeMode } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Share, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";
import {useAuth} from '../providers/AuthProvider'

export default function ({video, isViewable}) {
  const videoRef = useRef(null);
  const {user, likes, getLikes} = useAuth()
  const router = useRouter()
  useEffect(()=>{
    if(isViewable){
      videoRef.current?.playAsync();
    }else{
      videoRef.current?.pauseAsync();
    }
  },[isViewable])

  const shareVideo = () =>{
    Share.share({
      message:`Check out this video: ${video?.title}`
    })
  }
  const likeVideo = async() =>{
    const {data, error} = await supabase
    .from('Like')
    .insert({
      user_id: user?.id,
      video_id: video?.id,
      video_user_id: video?.User?.id,
    })
    if(!error) getLikes(user?.id)
  }

  const unLikeVideo = async() =>{
    const {data, error} = await supabase
    .from('Like')
    .delete()
    .eq('user_id', user?.id)
    .eq('video_id', video?.id)
    if(!error) getLikes(user?.id)
  }
  return (
    <View>
      <Video
      ref={videoRef}
      style={{
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
      source={{
        uri: video?.signedUrl,
      }}
      resizeMode={ResizeMode.COVER}
      isLooping
    />
      <View style={{position:'absolute',bottom: 75,left: 0,right:0}}>
        <View style={{flex:1, flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between', margin:12}}>
          <View>
            <Text style={{color:'white',fontSize:28,fontWeight:600}}>{video?.User?.username}</Text>
            <Text style={{color:'white',fontSize:20,fontWeight:500}}>{video?.title}</Text>
          </View>
          <View style={{gap:20}}>
            <TouchableOpacity onPress={()=>router.push(`/user?user_id=${video.User.id}`)}>
            <Ionicons name="person" size={36} color="white" />
            </TouchableOpacity>
            {likes.filter((like)=> like.video_id === video?.id).length > 0
            ?
            <TouchableOpacity onPress={unLikeVideo}>
             <Ionicons name="heart" size={36} color="red" />
            </TouchableOpacity>
             :
            <TouchableOpacity onPress={likeVideo}>
            <Ionicons name="heart-outline" size={36} color="white" />
            </TouchableOpacity>
            }
            <TouchableOpacity onPress={()=>router.push(`/comment?video_id=${video.id}`)}>
            <Ionicons name="chatbubble-ellipses" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareVideo}>
            <FontAwesome name="share" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}