# react-native-image-cropper

Image cropper for react native - iOS & android


https://user-images.githubusercontent.com/32338621/164317209-139da4dc-c484-48fe-9d8f-34fe1c71c032.mp4


https://user-images.githubusercontent.com/32338621/164281209-1430833c-47d6-467e-98b7-b624059f514c.mp4

## Installation

```sh
npm install https://github.com/cubukcuoglu/react-native-image-cropper.git
```

or

```sh
yarn add https://github.com/cubukcuoglu/react-native-image-cropper.git
```

## Peer dependencies

Make sure you have installed react native gesture handler > 2 and react native reanimated > 2.

```sh
npm install https://github.com/cubukcuoglu/react-native-frame.git react-native-gesture-handler react-native-reanimated @react-native-community/image-editor
```

or

```sh
# yarn
yarn add https://github.com/cubukcuoglu/react-native-frame.git react-native-gesture-handler react-native-reanimated @react-native-community/image-editor
```

## Usage

Mode contain and has frame

```jsx
import React, { useRef } from "react";
import ImageCrop, { IImageCropperImperativeHandle } from "react-native-image-cropper";

const Example = () => {
  const imageCropperRef = useRef<IImageCropperImperativeHandle>({} as IImageCropperImperativeHandle);

  const cropImage = async () => {
    const { uri, error } = await imageCropperRef.current?.cropImage();
  }

  return (
    <ImageCrop
      ref={imageCropperRef}
      mode="center"
      uri="..."
      frame={{
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
        }
      }} />
  )
};
```

Mode cover and no frame

```jsx
import React, { useRef } from "react";
import ImageCrop, { IImageCropperImperativeHandle } from "react-native-image-cropper";

const Example = () => {
  const imageCropperRef = useRef<IImageCropperImperativeHandle>({} as IImageCropperImperativeHandle);

  const cropImage = async () => {
    const { uri, error } = await imageCropperRef.current?.cropImage();
  }

  return (
    <ImageCrop
      ref={imageCropperRef}
      mode="cover"
      uri="..."
      container={{
        lines: {
          x: 3,
          y: 5,
        },
      }} />
  )
};
```

### Props

| Props | Type | Description | DefaultValue |
| --- | --- | --- | --- |
| uri | string | The uri of the image you want to crop | |
| mode | center or cover | Preference to center or extend the image in the container | center |
| container | { style?: StyleProp<ViewStyle>; lines?: { x: number; y: number; width?: number; color?: string; }; onChangeState?: (state: [IImageCropperOnChangeStateEvent](https://github.com/cubukcuoglu/react-native-image-cropper/blob/master/src/types.ts)) => void; onRenderChildren?: () => ReactNode; } | The area to be covered by the image | { style: { flex: 1, width: "100%", height: "100%", overflow: "hidden", backgroundColor: "black" }, lines: { width: 1, color: "rgba(250, 250, 250, .5)" } } } |
| frame | { style?: StyleProp<ViewStyle>; lines?: { x: number; y: number; width?: number; color?: string; }; points?: [IFramePoints](https://github.com/cubukcuoglu/react-native-frame/blob/master/src/types.ts), pointSize?: number; onChangeState?: (state: [IFrameBoxOnChangeStateEvent](https://github.com/cubukcuoglu/react-native-frame/blob/master/src/types.ts)) => void; }; onRenderChildren?: () => ReactNode; } | The area to crop the image | { style: { borderWidth: 1, borderColor: "rgba(250, 250, 250, 1)", width: "100%", aspectRatio: 3, }, lines: { width: 1, color: "rgba(250, 250, 250, 1)" }, points?: [DEFAULT_FRAME_POINTS](https://github.com/cubukcuoglu/react-native-image-cropper/blob/master/src/constants.ts), pointSize?: 20 } } |
| loading | [ActivityIndicatorProps](https://github.com/cubukcuoglu/react-native-image-cropper/blob/master/src/types.ts) | Animation that appears during image load | { style: { position: "absolute", zIndex: 2, top: 0, right: 0, bottom: 0, left: 0 }, color: "#FED600", size: "large" } |
| onChangeState | onChangeState?: (state: [IImageCropperOnChangeStateEvent](https://github.com/cubukcuoglu/react-native-image-cropper/blob/master/src/types.ts)) => void | It gives information about the status of events such as loading, scrolling, enlarging the picture |  |
| onHandleCropData | onHandleCropData?: (cropData: [IImageCropperImageCropData](https://github.com/cubukcuoglu/react-native-image-cropper/blob/master/src/types.ts)) => void | Function to edit the data of the picture before cropping |  |
  
## License

**[Read Only License 1.0](https://github.com/crazycodeboy/react-native-splash-screen/blob/master/LICENSE)**


