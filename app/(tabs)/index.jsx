import { View, FlatList, Dimensions } from 'react-native';
import { supabase } from '../../utils/supabase';
import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer'
import Header from '../../components/header'

export default function () {
  const [videos, setVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  useEffect(()=>{
    getVideos()
  },[])

  const getVideos = async () => {
    const {data} = await supabase
    .from('Video')
    .select('*, User(username, id)')
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
    <View>
      <View style={{position:'absolute', top:20, left:0, right:0, zIndex:10}}>
      <Header title='For You' color='white'/>
      </View>
      <FlatList
      data={videos}
      snapToInterval={Dimensions.get('window').height}
      snapToStart
      decelerationRate='fast'
      onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
      renderItem={({item})=>
        <VideoPlayer video={item} isViewable={activeIndex === item.id}/>
      }
      />
    </View>
  );
}
