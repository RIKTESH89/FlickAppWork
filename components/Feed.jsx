

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert,Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import SvgComponent from './assets/Save';
import SvgComponentSaved from './assets/Saved';
import Animation from './assets/SavingAnimation';

const saveFile = async (videoUri, imageUri) => {
  let done=false;
  try {
    console.log("videoUri: " + videoUri + ", imageUri: " + imageUri);
    const val = Date.now().toString();
    const outputFilePath = `${FileSystem.documentDirectory}output_${val}.mp4`;
    const commandff = `-i ${videoUri} -i ${imageUri} -filter_complex "[1:v]format=rgba,geq=lum='p(X,Y)':a='st(1,pow(min(W/2,H/2),2))+st(3,pow(X-(W/2),2)+pow(Y-(H/2),2));if(lte(ld(3),ld(1)),255,0)',scale=iw*0.1:-1[circle];[0:v][circle]overlay=16:H-h+30[v]" -map "[v]" -map 0:a -c:v mpeg4 -b:v 8000k -c:a aac -shortest ${outputFilePath}`;
    // 

    const session = await FFmpegKit.execute(commandff)
      const returnCode = await session.getReturnCode();
      try {
          if (ReturnCode.isSuccess(returnCode)) {
              // SUCCESS
              console.log("Awesome, it's successful");
              done= true;
          } else if (ReturnCode.isCancel(returnCode)) {
              // CANCEL
              console.log("It's cancelled");
          } else {
              // FAILURE
              console.log("It's failed");
              console.log("Return code: ", returnCode);
              console.log("output file path: ", outputFilePath);
          }
      } catch (error) {
          console.log("This is the error:", error);
      }
    const asset = await MediaLibrary.saveToLibraryAsync(outputFilePath);
    // Alert.alert('Video saved successfully!');
  } catch (error) {
    console.log('Error saving file:', error);
    // Alert.alert('Failed to save video!', error.message);
  }
  return done;
};

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [permission, setPermission] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState([]);
  const [savingStatus, setsavingStatus] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status === 'granted');
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

    })();

    async function fetchVideos() {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const length = keys.length;
        const emptyArray = Array(length).fill(false);
        setDownloadStatus(emptyArray);
        setsavingStatus(emptyArray);
        const videoKeys = keys.filter(key => key.startsWith('video_'));
        const videoURIs = await AsyncStorage.multiGet(videoKeys);
        console.log(videoURIs);
        setVideos(videoURIs.map(item => JSON.parse(item[1])));
      } catch (err) {
        console.log(err);
      }
    }
    fetchVideos();
  }, []);

  const getLocalPath = (uri) => uri.replace('file://', '');

  const handleDownload = async (index, videoValue, cameraValue) => {
    const done = await saveFile(videoValue, cameraValue);
    if (done) {
      Alert.alert("Video saved successfully!");
      setDownloadStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = true;
        return newStatus;
      });
      setsavingStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = false;
        return newStatus;
      });
    } else {
      Alert.alert("Failed to save video!");
    }
  };
  

  if (permission === null) {
    return <Text>Requesting for media library permissions...</Text>;
  }

  if (permission === false) {
    return <Text>Permission to access media library is required!</Text>;
  }

  return (
    <View style={styles.container}>
    <View style={styles.feed}>
      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item,index }) => (
          <View style={styles.feedItem}>
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: item?.videoValue }}
                rate={0.3}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                isLooping
                shouldPlay
                style={styles.video}
              />
            </View>
            <View>
              <View style={styles.selfieContainer}>
                <Image
                  source={{ uri: item?.cameraValue }}
                  style={styles.selfie}
                  borderRadius={10000}
                />
              </View>
                <TouchableOpacity 
                  onPress={function() { 
                    setsavingStatus((prevStatus) => {
                      const newStatus = [...prevStatus];
                      newStatus[index] = true;
                      return newStatus;
                    });
                    handleDownload(index, item?.videoValue, item?.cameraValue)}}
                >
                  { savingStatus[index] ? <Animation />:

                  !downloadStatus[index] ? <SvgComponent />:
                  <SvgComponentSaved/>}
                </TouchableOpacity>
              </View>
          </View>
        )}
      />
    </View>
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
feed: {
  padding: 20,
  backgroundColor: '#f9f9f9',
},
feedItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 5,
},
indexContainer: {
  marginRight: 10,
},
indexText: {
  fontSize: 18,
  fontWeight: 'bold',
},
contentContainer: {
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'space-between',
},

videoContainer: {
  flex: 1,
  marginRight: 10,
},
video: {
  width: '100%',
  height: 200,
  borderRadius: 10,
},
selfieContainer: {
  width: 80,
  height: 80,
  marginLeft: 10,
  marginBottom:50
},
selfie: {
  width: '100%',
  height: '100%',
  borderRadius: 25,
},
downloadButton: {
  marginLeft: 10,
  padding: 10,
},
downloadText: {
  fontSize: 24,
},
});