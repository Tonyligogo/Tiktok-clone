import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';

export default function ProfileScreen() {
  const {signOut} = useAuth();
  return (
    <View>
      <Text style={{color:'red', fontWeight:800}} >Profile screen</Text>
      <TouchableOpacity onPress={()=>signOut()}>
        <Text style={{marginTop:20, padding:10, backgroundColor:'black',color:'white'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
