import { ForwardedRef, ReactNode, RefObject } from "react";
import {
    ActivityIndicatorProps,
    ImageStyle,
    LayoutChangeEvent,
    StyleProp,
    ViewProps,
    ViewStyle
} from "react-native";
import {
    GestureEvent,
    HandlerStateChangeEvent,
    PanGestureHandlerEventPayload,
    PinchGestureHandlerEventPayload,
    TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
    IFrameBoxProps,
    IFrameImperativeHandle
} from "react-native-frame";

export type IImageCropperPinchGestureContext = {
    scale: number;
    lastScale: number;
}

export type IImageCropperPanGestureContext = {
    translateY: number;
    translateX: number;
    scale: number;
}

export interface IImageCropperProps {
    uri: string;
    mode?: "center" | "cover";
    container?: IImageCropperContainer;
    frame?: IImageCropperCropFrame;
    loading?: ActivityIndicatorProps;
    onChangeState?: (state: IImageCropperOnChangeStateEvent) => void;
}

export interface IImageCropperContainer {
    style?: StyleProp<ViewStyle>;
    lines?: IImageCropperLinesProps;
    onRenderChildren?: () => ReactNode;
}

export interface IImageCropperCropFrame extends Omit<IFrameBoxProps, keyof ViewProps> {
    style?: StyleProp<ViewStyle>;
    lines?: IImageCropperLinesProps;
    onRenderChildren?: () => ReactNode;
}

export interface IImageCropperHook {
    props: IImageCropperProps
}

export interface IImageCropperSize {
    width?: number | string;
    height?: number | string;
}

export type IImageCropperCropImageResolve = Promise<{ uri?: string, error?: any }>;

export type IImageCropperImageError = { message: string };

export interface IImageCropperContext {
    mainProps: IImageCropperProps;
    frameRef: ForwardedRef<IFrameImperativeHandle>;
    containerRef: RefObject<Animated.View>;
    frameContainerRef: RefObject<Animated.View>;
    imageRef: RefObject<Animated.Image>;
    isDoubleZooming: boolean;
    imageRatio: number | undefined;
    imageStatus: IImageCropperImageStatus;
    canVisible: any;
    rWrapperStyle: StyleProp<ViewStyle>;
    rImageStyle: StyleProp<ImageStyle>;
    rFrameContainerStyle: StyleProp<ViewStyle>;
    cropImage: () => IImageCropperCropImageResolve;
    onContainerLayout: ((event: LayoutChangeEvent) => void) | undefined;
    onImageLayout: ((event: LayoutChangeEvent) => void) | undefined;
    onImageLoad: () => void;
    onImageError: (event: IImageCropperImageError) => void;
    onTapGestureEvent: (event: GestureEvent<TapGestureHandlerEventPayload>) => void;
    onPinchGestureEvent: (event: GestureEvent<PinchGestureHandlerEventPayload>) => void;
    onPanGestureEvent: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
    onPinchHandlerStateChange: (event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => void;
    onPanHandlerStateChange: (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => void;
}

export interface IImageCropperImperativeHandle {
    cropImage: () => IImageCropperCropImageResolve;
}

export interface IImageCropperLinesProps {
    x: number;
    y: number;
    width?: number;
    color?: string;
}

export interface IImageCropperMeasure {
    width: number;
    height: number;
    x: number;
    y: number;
    pageX: number;
    pageY: number;
}

export interface IImageCropperImageStatus {
    isLoaded: boolean;
    error: IImageCropperImageError | undefined;
}

export interface IImageCropperStatements {
    image?: IImageCropperImageStatus;
    isDoubleZooming?: boolean;
    isZooming?: boolean;
    isDragging?: boolean;
}

export interface IImageCropperOnChangeStateEvent extends IImageCropperStatements {
    state: IImageCropperStatements;
}