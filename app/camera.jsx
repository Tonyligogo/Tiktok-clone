import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../utils/supabase";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";

export default function App() {
  const { user } = useAuth();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [status, setStatus] = useState({ isLoaded: false, isPlaying: true });
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef?.current?.stopRecording();
      return;
    }
    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync();
      setVideoUri(video.uri);
    } catch (error) {
      console.error("Error recording video:", error);
      setIsRecording(false);
    }
  };

  const saveVideo = async () => {
    const formData = new FormData();
    const fileName = videoUri?.split("/").pop();
    formData.append("file", {
      uri: videoUri,
      type: `video/${fileName?.split(".").pop()}`,
      name: fileName,
    });
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(fileName, formData, {
        cacheControl: "3600000000",
        upsert: false,
      });
    if (error) console.error('video storage error',error);
    const { error: videoError } = await supabase.from("Video").insert({
      title: "Test title",
      url: data?.path,
      user_id: user?.id,
    });
    if (videoError) console.error("video error", videoError);
    router.back();
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <View style={{ flex: 1, position: "relative" }}>
          <TouchableOpacity
            style={{ position: "absolute", bottom: 80, left: '40%', zIndex:10 }}
            onPress={saveVideo}
          >
            <Ionicons name="checkmark-circle" size={70} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              status.isPlaying
                ? videoRef.current.pauseAsync()
                : videoRef.current.playAsync()
            }
            activeOpacity={1}
            style={{flex:1}}
          >
            <Video
              ref={videoRef}
              style={{
                flex: 1,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
              }}
              source={{
                uri: videoUri,
              }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          mode="video"
          mute={true}
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="aperture" size={40} color="white" />
            </TouchableOpacity>
            {videoUri ? (
              <TouchableOpacity onPress={saveVideo}>
                <Ionicons name="checkmark-circle" size={70} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={recordVideo}>
                <Ionicons
                  name={isRecording ? "pause-circle" : "radio-button-on"}
                  size={70}
                  color={isRecording ? "red" : "white"}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: "auto",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 40,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
