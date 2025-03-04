import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../components/header';
import { supabase } from '../utils/supabase';
import { useEffect, useState } from 'react';
import Profile from '../components/profile';

export default function () {
  const params = useLocalSearchParams()
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const getUser = async () => {
    const {data, error} = await supabase
    .from('User')
    .select('*')
    .eq('id', params.user_id)
    .single();
    if(error) return console.log(error)
    setUser(data)
  }
  const getFollowing = async () => {
    const { data, error } = await supabase
      .from("Follower")
      .select("*")
     .eq("user_id", params.user_id);
    if (!error) setFollowing(data);
  }

  const getFollowers = async () => {
    const { data, error } = await supabase
      .from("Follower")
      .select("*")
     .eq("follower_user_id", params.user_id);
    if (!error) setFollowers(data);
  }
  useEffect(()=>{
    getUser()
    getFollowing()
    getFollowers()
  },[params.user_id])
  return (
    <SafeAreaView>
      <Header title={user?.username} color='black' goBack/>
      <Profile
      user={user}
      following={following}
      followers={followers}
      />
    </SafeAreaView>
  );
}
