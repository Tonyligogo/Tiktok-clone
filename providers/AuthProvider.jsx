import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);

  const getLikes = async (userId) => {
    if(!userId) return
    const { data, error } = await supabase
      .from("Like")
      .select("*")
     .eq("user_id", userId);
    if (error) return console.error(error);
    setLikes(data);
  }

  const getFollowing = async (userId) => {
    if(!userId) return
    const { data, error } = await supabase
      .from("Follower")
      .select("*")
     .eq("user_id", userId);
    if (!error) setFollowing(data);
  }

  const getFollowers = async (userId) => {
    if(!userId) return
    const { data, error } = await supabase
      .from("Follower")
      .select("*, User(*)")
     .eq("follower_user_id", userId);
    if (!error) setFollowers(data);
  }

  const getFriends = () => {
    const followingIds = following.map(f => f.follower_user_id);
    const followerIds = followers.map(f => f.user_id);
    const duplicates = followingIds.filter(id => followerIds.includes(id));
    setFriends(duplicates)
  }
  useEffect(()=>{
    getFriends()
  },[followers,following])

  const getUser = async (id) => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return console.error(error);
    setUser(data);
    getLikes(data.id);
    getFollowing(data.id);
    getFollowers(data.id);
    router.push("/(tabs)");
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.error(error);
    }
    getUser(data?.user?.id);
  };

  const signUp = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      username,
    });
    if (error) return console.error(error);
    const { error: userError } = await supabase
      .from("User")
      .insert({
        id: data?.user?.id,
        username,
        email,
      });
    if (userError) return console.error(userError);
    getUser(data?.user?.id);
    //dismiss the signup modal first
    router.back();
    router.push("/(tabs)");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/(auth)");
  };

  useEffect(()=>{
    const {data:authData} = supabase.auth.onAuthStateChange((event, session)=>{
        if(!session) return router.push("/(auth)")
        getUser(session?.user?.id)
    })
    return () => {
        authData.subscription.unsubscribe();
    }
  },[])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        likes,
        getLikes,
        followers,
        getFollowers,
        following,
        getFollowing,
        friends,
        getFriends,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
