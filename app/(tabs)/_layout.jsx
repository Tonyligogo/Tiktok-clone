import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:'white',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle:{backgroundColor:'transparent',borderColor:'transparent', shadowColor:'transparent',position:'absolute',paddingTop:30, height:85},
        tabBarBackground:() =>(
          <LinearGradient  colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']} style={{height:250,position:'absolute',top:0,left:0,right:0}}/>
        )
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon:({focused})=> <Ionicons name={focused ? "home-sharp" :"home-outline"} size={28} color="white" />
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon:({focused})=> <Ionicons name={focused ? "people" : "people-outline"} size={28} color="white" />
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: '',
          tabBarIcon:() => 
            <View style={{position:'absolute', bottom:-20, width:60}}>
              <Ionicons name="add-circle" size={65} color="white" />
            </View>
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/camera')
          }
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon:({focused})=> <Ionicons name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={28} color="white" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon:({focused})=> <Ionicons name={focused ? "person" : "person-outline"} size={28} color="white" />
        }}
      />
    </Tabs>
  );
}
