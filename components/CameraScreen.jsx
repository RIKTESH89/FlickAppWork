import { useState,useRef } from 'react';
import { ScrollView, StatusBar, Button } from 'react-native';
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState("front");
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flashMode, setFlashMode] = useState('off')
  const [permission, requestPermission] = useCameraPermissions();
  const [croppedImageUri, setCroppedImageUri] = useState(null);
  
  function toggleCameraFacing() {
    setType((current)=> current === "back" ? "front" : "back");
    }

    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
    if(!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
    // const permission = await Camera.requestCameraPermissionsAsync()

  const __startCamera = async () => {
    if(permission && permission.granted){
      setStartCamera(true)
    }
    else{
      Alert.alert('Permission denied')
    }
  }




  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    const recordTime = Date.now().toString();
    // const manipResult = await ImageManipulator.manipulateAsync(
    //   photo.uri,
    //   [],
    //   { base64: true }
    // );

    // const originalWidth = manipResult.width;
    // const originalHeight = manipResult.height;
    // const cropHeight = originalHeight / 2;
    // const cropWidth = originalWidth;
    // const cropY = (originalHeight - cropHeight) / 2;

    // // Perform the crop
    // const cropResult = await ImageManipulator.manipulateAsync(
    //   photo.uri,
    //   [
    //     {
    //       crop: {
    //         originX: 0,
    //         originY: cropY,
    //         width: cropWidth,
    //         height: cropHeight,
    //       },
    //     },
    //   ],
    //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    // );

    // setCroppedImageUri(cropResult.uri);

    const newImageUri = FileSystem.documentDirectory + 'smallImage' + recordTime + '.jpg';
    if(photo.uri){

      await FileSystem.moveAsync({
      from: photo.uri,
      to: newImageUri,
    });
    setCapturedImage(newImageUri)
  }
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  function toggleCameraFacing() {
    setType(current => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {true ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} retakePicture={__retakePicture} navigation={navigation}/>
          ) : (
            <CameraView
              facing={type}
              flash={flashMode}
              mode='picture'
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleCameraFacing}
                    style={{
                      marginTop: 20,
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      {type === 'front' ? '🤳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </CameraView>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});





const CameraPreview = ({photo, retakePicture,navigation}) => {
  console.log('sdsfds', photo)
  return (
    <View>
      <Image
        source={{uri: photo}}
        style={{height: 600, width: 450}}
      />
      <Button
        onPress={retakePicture}
        title="Retake"
      />
      <Button
        onPress={() => navigation.navigate({
          name: 'Video',
          params : {photoUri : photo},
          merge: true
        })}
        title="Done"
      />
    </View>
  )
}