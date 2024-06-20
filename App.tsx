
import FlickVideo from './components/Video';
import { useState } from 'react';
import * as React from 'react';
import { View, Text,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen  from './components/Home';
import CameraScreen from './components/CameraScreen';
import Feed from './components/Feed';
import AsyncStorage from '@react-native-async-storage/async-storage';


function DetailsScreen(){
  const [clear,setclear] = useState('Clear all data');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={async () => {
  try {
    await AsyncStorage.clear()
    setclear('All data cleared')
    console.log("done")
  } catch(e) {
    // clear error
    console.log(e)
  }

  console.log('Done.')
}} title={clear}/>
    </View>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title:"Snapshot"}} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="Video" component={FlickVideo} />
        <Stack.Screen name="Details" component={DetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;