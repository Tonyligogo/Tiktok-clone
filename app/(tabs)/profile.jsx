import { useEffect } from "react";
import Profile from "../../components/profile";
import { useAuth } from "../../providers/AuthProvider";

export default function ProfileScreen() {
  const { user, following, followers, getFollowers } = useAuth();
    useEffect(()=>{
      getFollowers(user?.id)
    },[user?.id])
  return (
    <Profile user={user} following={following} followers={followers}/>
  );
}
