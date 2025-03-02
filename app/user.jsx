import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../components/header';

export default function () {
  const params = useLocalSearchParams()
  console.log(params)
  return (
    <SafeAreaView>
      <Header title='For You' color='white' goBack/>
      <Text style={{color:'red', fontWeight:800}} >User screen</Text>
    </SafeAreaView>
  );
}
