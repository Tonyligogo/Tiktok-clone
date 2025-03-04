import { View, FlatList, Dimensions, Text } from 'react-native';
import { supabase } from '../../utils/supabase';
import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer'
import Header from '../../components/header'
import { useAuth } from '../../providers/AuthProvider';
import { useIsFocused } from '@react-navigation/native';

export default function () {
  const {friends} = useAuth()
  const [videos, setVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const isFocused = useIsFocused()
  useEffect(()=>{
    getVideos()
  },[])

  const getVideos = async () => {
    const {data} = await supabase
    .from('Video')
    .select('*, User(*)')
    .in('user_id', friends)
    .order('created_at', {ascending: false})
    getSignedUrls(data)
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
  return (
    <View style={{backgroundColor:'black', flex:1}}>
      <View style={{paddingTop:10, paddingBottom:20}}>
      <Header title='Friends' color='white' goBack/>
      </View>
      <FlatList
      data={videos}
      snapToInterval={Dimensions.get('window').height}
      snapToStart
      decelerationRate='fast'
      onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
      renderItem={({item})=>
        <VideoPlayer video={item} isViewable={activeIndex === item.id && isFocused}/>
      }
      ListEmptyComponent={
        <View style={{marginTop:100 }}>
          <Text style={{textAlign:'center', fontSize:20, color:'white'}}>You have no friends yet</Text>
        </View>
      }
      />
    </View>
  );
}
