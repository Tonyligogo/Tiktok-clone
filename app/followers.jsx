import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../components/header";
import { useAuth } from "../providers/AuthProvider";

export default function InboxScreen() {
  const { followers } = useAuth();
  const router = useRouter();
  return (
    <SafeAreaView style={{backgroundColor:'black', flex:1}}>
      <Header title="Followers" color="white" goBack />
      <FlatList
        data={followers}
        style={{marginTop:20, paddingInline:10}}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/user?user_id=${item.user_id}`)}
            style={{ flexDirection: "row", gap: 8 }}
          >
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_AVATAR_BUCKET}/${item?.User?.id}/avatar.jpeg` || 'https://placehold.co/40x40' }}
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
              <Text style={{ fontSize: 18, color:'white' }}>Say hi</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
