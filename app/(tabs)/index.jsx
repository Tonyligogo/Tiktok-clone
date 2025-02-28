import { View, Text } from 'react-native';
import {useAuth} from '../../providers/AuthProvider'

export default function () {
  const {user} = useAuth();
  return (
    <View>
      <Text style={{fontWeight:800}} >Home</Text>
      <Text>{JSON.stringify(user)}</Text>
    </View>
  );
}
