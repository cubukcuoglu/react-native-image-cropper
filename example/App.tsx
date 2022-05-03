import "react-native-gesture-handler";

import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import ImageCrop, { IImageCropperImperativeHandle } from "react-native-image-cropper";
import Feather from "react-native-vector-icons/Feather";

const App = () => {
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [croppedImageUri, setCroppedImageUri] = useState<string>();

  const imageCropperRef = useRef<IImageCropperImperativeHandle>({} as IImageCropperImperativeHandle);

  const cropImage = async () => {
    setIsCropping(true);

    const { uri } = await imageCropperRef.current?.cropImage();

    setCroppedImageUri(uri);
    setIsCropping(false);
  }

  const backCropImage = () => setCroppedImageUri(undefined);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Image Cropper
        </Text>
        {
          isCropping ?
            <View style={styles.headerButton}>
              <ActivityIndicator size="small" />
            </View> :
            <TouchableOpacity
              style={styles.headerButton}
              onPress={croppedImageUri ? backCropImage : cropImage}>
              <Feather
                name={croppedImageUri ? "x" : "check"}
                style={styles.headerButtonIcon} />
            </TouchableOpacity>
        }
      </View>
      <View style={styles.body}>
        {
          croppedImageUri ?
            <Image
              style={styles.croppedImage}
              source={{ uri: croppedImageUri }} /> :
            <ImageCrop
              ref={imageCropperRef}
              mode="center"
              uri="https://images.unsplash.com/photo-1540331547168-8b63109225b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=719&q=80"
              /*
              container={{
                  lines: {
                      x: 3,
                      y: 5
                  },
                  style: {
                      width: "100%",
                      height: "100%"
                  }
              }}
              */
              frame={{
                style: {
                  minWidth: 100,
                  minHeight: 50
                },
                lines: {
                  x: 2,
                  y: 0
                },
                points: {
                  "top-left": { type: "scale-lock" },
                  "top-right": { type: "scale-lock" },
                  "bottom-left": { type: "scale-lock" },
                  "bottom-right": { type: "scale-lock" },
                  "top": { type: "scale" },
                  "right": { type: "scale" },
                  "bottom": { type: "scale" },
                  "left": { type: "scale" },
                },
                onChangeState: (event) => console.log("frame event", event)
              }}
              onChangeState={(event) => console.log("image event", event)} />
        }
      </View>
    </SafeAreaView>
  )
};

const spaceHorizontal = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "black",
    marginLeft: spaceHorizontal
  },
  headerButton: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: spaceHorizontal,
  },
  headerButtonIcon: {
    fontSize: 24
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  croppedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  }
});

export default App;