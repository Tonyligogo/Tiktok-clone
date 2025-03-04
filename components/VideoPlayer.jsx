import { Video, ResizeMode } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { supabase } from "../utils/supabase";
import { useAuth } from "../providers/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";

export default function ({ video, isViewable }) {
  const videoRef = useRef(null);
  const { user, likes, getLikes, following, getFollowing } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isViewable]);

  const shareVideo = () => {
    Share.share({
      message: `Check out this video: ${video?.title}`,
    });
  };
  const likeVideo = async () => {
    const { error } = await supabase.from("Like").insert({
      user_id: user?.id,
      video_id: video?.id,
      video_user_id: video?.User?.id,
    });
    if (!error) getLikes(user?.id);
  };
  const unLikeVideo = async () => {
    const { error } = await supabase
      .from("Like")
      .delete()
      .eq("user_id", user?.id)
      .eq("video_id", video?.id);
    if (!error) getLikes(user?.id);
  };
  const followUser = async () => {
    const { error } = await supabase.from("Follower").insert({
      user_id: user?.id,
      follower_user_id: video?.User?.id,
    });
    if (!error) getFollowing(user?.id);
  };

  const unFollowUser = async () => {
    const { error } = await supabase
      .from("Follower")
      .delete()
      .eq("user_id", user?.id)
      .eq("follower_user_id", video?.User?.id);
    if (!error) getFollowing(user?.id);
  };
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
      {/* <View style={{ position: "absolute", bottom: 75, left: 0, right: 0 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            margin: 16,
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 28, fontWeight: 600 }}>
              {video?.User?.username}
            </Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: 500 }}>
              {video?.title}
            </Text>
          </View>
          <View style={{ gap: 28 }}>
            <View>
              <TouchableOpacity
                onPress={() => router.push(`/user?user_id=${video.User.id}`)}
              >
                <Image
                  source={{uri:`${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${video?.User.id}/avatar.jpeg` || 'https://placehold.co/40x40'}}
                  style={{width:40, height:40,backgroundColor:'black' ,borderRadius:50}}
                />
              </TouchableOpacity>
              {following?.filter(
                (following) => following?.follower_user_id === video?.User?.id
              ).length > 0 ? (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: -10,
                    backgroundColor: "red",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={unFollowUser}
                >
                  <Ionicons name="remove" size={21} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: -10,
                    backgroundColor: "red",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={followUser}
                >
                  <Ionicons name="add" size={21} color="white" />
                </TouchableOpacity>
              )}
            </View>
            {likes?.filter((like) => like.video_id === video?.id).length > 0 ? (
              <TouchableOpacity onPress={unLikeVideo}>
                <Ionicons name="heart" size={36} color="red" />
                <Text style={{color:'white', textAlign:'center'}}>{likes?.length}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={likeVideo}>
                <Ionicons name="heart-outline" size={36} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.push(`/comment?video_id=${video.id}&video_user_id=${video.User.id}`)}
            >
              <Ionicons name="chatbubble-ellipses" size={36} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareVideo}>
              <FontAwesome name="share" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0)"]} // Dark at the top, fading to transparent
        style={styles.gradient}
      >
        <View
          style={{
            position: "absolute",
            top: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 100,
            paddingInline: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/comment?video_id=${video.id}&video_user_id=${video.User.id}`
              )
            }
          >
            <Ionicons name="chatbubble-ellipses" size={36} color="white" />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              onPress={() => router.push(`/user?user_id=${video.User.id}`)}
            >
              <Image
                source={{
                  uri:
                    `${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${video?.User.id}/avatar.jpeg` ||
                    "https://placehold.co/40x40",
                }}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "black",
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
            {following?.filter(
              (following) => following?.follower_user_id === video?.User?.id
            ).length > 0 ? (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: -10,
                  backgroundColor: "red",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={unFollowUser}
              >
                <Ionicons name="remove" size={21} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: -16,
                  right: -10,
                  backgroundColor: "red",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={followUser}
              >
                <Ionicons name="add" size={21} color="white" />
              </TouchableOpacity>
            )}
          </View>
          {likes?.filter((like) => like.video_id === video?.id).length > 0 ? (
            <TouchableOpacity onPress={unLikeVideo}>
              <Ionicons name="heart" size={36} color="red" />
              <Text style={{ color: "white", textAlign: "center" }}>
                {likes?.length}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={likeVideo}>
              <Ionicons name="heart-outline" size={36} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 100,
    zIndex: 100,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
