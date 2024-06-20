import { useEffect,useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Animation from './assets/SavingAnimation';

function HomeScreen({navigation}) {

    const [state, setState] = useState("");

    useEffect(() => {
        setState("Hello");
    }, []);

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <TouchableOpacity style={styles.appButtonContainer}  onPress={function(){navigation.push('Details')}}>
            <Text style={styles.appButtonText}>Clear Feed</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.appButtonContainer} onPress={function(){navigation.push('Feed',{
            sendData:state
        })}}>
            <Text style={styles.appButtonText}>Go to Feed</Text>
          </TouchableOpacity>




          <TouchableOpacity style={styles.appButtonContainer} onPress={function(){navigation.push('Video')}}>
            <Text style={styles.appButtonText}>Take Snaps</Text>
          </TouchableOpacity>
          
      </View>
    );
  }

  const styles = StyleSheet.create({
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 4,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-center',
      alignItems: 'center',
    },
    text: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'black',
    },
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical:20
    },
    appButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
  });
  
  export default HomeScreen;