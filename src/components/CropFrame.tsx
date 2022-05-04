import React, { FC, useContext, useMemo } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import Frame from "react-native-frame";

import styles from "../style";
import { Context } from "../hook";
import { DEFAULT_FRAME_BORDER_COLOR } from "../constants";
import { Lines } from "./Lines";

const CropFrame: FC = () => {
    const { mainProps, frameContainerRef, frameRef, canVisible, rFrameContainerStyle } = useContext(Context);

    const { frame } = mainProps;

    return useMemo(() => {
        return (frame && canVisible) ?
            <View style={styles.frameImageSize} pointerEvents="auto">
                <Animated.View ref={frameContainerRef} style={rFrameContainerStyle}>
                    <Frame.Container
                        ref={frameRef}
                        style={[styles.frameContainer]}>
                        <Frame.Box
                            {...frame}
                            style={frame?.style ?? styles.frameWrapper}>
                            {
                                frame?.lines ?
                                    <Lines 
                                        color={DEFAULT_FRAME_BORDER_COLOR} 
                                        {...frame?.lines} /> :
                                    undefined
                            }
                            {frame?.onRenderChildren?.()}
                        </Frame.Box>
                    </Frame.Container>
                </Animated.View>
            </View> :
            null
    }, [
        JSON.stringify(frame),
        canVisible
    ]);
};

export { CropFrame };