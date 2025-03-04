import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
const Header = ({title, color, goBack=false}) => {
    const router = useRouter()
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', marginTop:10}}>
        <View style={{width:40}}>
        {goBack && <TouchableOpacity onPress={()=>router.back()}>
        <Ionicons name="chevron-back" size={30} color={color} />
        </TouchableOpacity>}
        </View>
      <Text style={{color:color, fontWeight:600, fontSize:28}}>{title}</Text>
        <View style={{width:40}}>
        <TouchableOpacity onPress={()=>router.push('/search')}>
        <Ionicons name="search" size={30} color={color} />
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default Header