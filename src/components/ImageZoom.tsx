import React, { FC, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";
import {
    GestureHandlerRootView,
    PinchGestureHandler,
    PanGestureHandler,
    TapGestureHandler,
} from "react-native-gesture-handler";

import styles from "../style";
import { Context } from "../hook";
import { CropFrame, Lines } from ".";
import { DEFAULT_LOADING_COLOR, DEFAULT_LOADING_SIZE } from "../constants";

const ImageZoom: FC = () => {
    const {
        mainProps,
        containerRef,
        imageRef,
        isDoubleZooming,
        imageStatus,
        rWrapperStyle,
        rImageStyle,
        onTapGestureEvent,
        onPinchGestureEvent,
        onPanGestureEvent,
        onContainerLayout,
        onImageLayout,
        onImageError,
        onImageLoad,
        onPinchHandlerStateChange,
    } = useContext(Context);

    const {
        uri,
        container,
        loading
    } = mainProps;

    return (
        <View style={[styles.container, container?.style]} onLayout={onContainerLayout}>
            <Animated.View ref={containerRef} style={[styles.wrapper, rWrapperStyle]}>
                <GestureHandlerRootView>
                    <PinchGestureHandler
                        enabled={!isDoubleZooming}
                        onHandlerStateChange={onPinchHandlerStateChange}
                        onGestureEvent={onPinchGestureEvent}>
                        <Animated.View>
                            <PanGestureHandler
                                maxPointers={1}
                                enabled={!isDoubleZooming}
                                onGestureEvent={onPanGestureEvent}>
                                <Animated.View>
                                    <TapGestureHandler
                                        numberOfTaps={2}
                                        enabled={!isDoubleZooming}
                                        onGestureEvent={onTapGestureEvent}>
                                        <Animated.View>
                                            <Animated.Image
                                                ref={imageRef}
                                                style={rImageStyle}
                                                source={{ uri }}
                                                resizeMethod="resize"
                                                onLayout={onImageLayout}
                                                onError={(event) => {
                                                    onImageError({ message: event.nativeEvent.error });
                                                }}
                                                onLoad={onImageLoad} />
                                            <CropFrame />
                                        </Animated.View>
                                    </TapGestureHandler>
                                </Animated.View>
                            </PanGestureHandler>
                        </Animated.View>
                    </PinchGestureHandler>
                </GestureHandlerRootView>
                {
                    container?.lines ?
                        <View style={styles.linesWrapper} pointerEvents="none">
                            <Lines {...container?.lines} />
                        </View> :
                        undefined
                }
            </Animated.View>
            {
                (!imageStatus.isLoaded && !imageStatus.error) ?
                    <ActivityIndicator
                        style={styles.loading}
                        color={DEFAULT_LOADING_COLOR}
                        size={DEFAULT_LOADING_SIZE}
                        {...loading} /> :
                    null
            }
        </View>
    );
};

export default ImageZoom;