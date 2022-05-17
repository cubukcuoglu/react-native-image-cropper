import { useState, useEffect, createContext, useRef, RefObject } from "react";
import { LayoutChangeEvent, LayoutRectangle, ImageStyle, ViewStyle } from "react-native";
import Animated, {
    useAnimatedRef,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import {
    PanGestureHandlerGestureEvent,
    PinchGestureHandlerGestureEvent,
    TapGestureHandlerGestureEvent,
    State,
    HandlerStateChangeEvent,
    TapGestureHandlerEventPayload,
    GestureEventPayload,
} from "react-native-gesture-handler";
import ImageEditor from "@react-native-community/image-editor";
import ImageSize from "react-native-image-size";
import { IFrameImperativeHandle } from "react-native-frame";

import {
    IImageCropperPinchGestureContext,
    IImageCropperPanGestureContext,
    IImageCropperHook,
    IImageCropperContext,
    IImageCropperImageStatus,
    IImageCropperCropImageResolve,
    IImageCropperMeasure,
    IImageCropperStatements,
    IImageCropperImageError,
    IImageCropperImageCropData
} from "./types";
import {
    DEFAULT_IMAGE_STATE,
    DEFAULT_MODE,
    DEFAULT_STATEMENTS
} from "./constants";

export const Context = createContext<IImageCropperContext>({} as IImageCropperContext)

const useHook = ({ props }: IImageCropperHook) => {
    const { mode = DEFAULT_MODE, uri, frame, onChangeState, onHandleCropData } = props;

    const containerRef = useAnimatedRef<Animated.View>();
    const imageRef = useAnimatedRef<Animated.Image>();
    const frameContainerRef = useAnimatedRef<Animated.View>();
    const frameRef = useRef<IFrameImperativeHandle>({} as IFrameImperativeHandle);

    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);

    const frameContainerWidth = useSharedValue<number>(0);
    const frameContainerHeight = useSharedValue<number>(0);

    const containerLayout = useSharedValue<LayoutRectangle>({ width: 0, height: 0, x: 0, y: 0 });
    const imageLayout = useSharedValue<LayoutRectangle>({ width: 0, height: 0, x: 0, y: 0 });

    const [imageRatio, setImageRatio] = useState<number>(0);
    const [isDoubleZooming, setIsDoubleZooming] = useState(false);

    const [imageStatus, setImageStatusState] = useState<IImageCropperImageStatus>(DEFAULT_IMAGE_STATE);
    const imageStatusRef = useRef<IImageCropperImageStatus>(DEFAULT_IMAGE_STATE);

    const statements = useRef<IImageCropperStatements>(DEFAULT_STATEMENTS);

    const minScale = 1;
    const maxScale = 4;

    useEffect(() => {
        setImageStatus(DEFAULT_IMAGE_STATE);

        getImageRatio();
    }, [uri]);

    useEffect(() => {
        changeStatements?.({ image: imageStatus });
    }, [
        JSON.stringify(imageStatus),
    ]);

    useEffect(() => {
        changeStatements?.({ isDoubleZooming });
    }, [
        isDoubleZooming,
    ]);

    const changeStatements = (params: IImageCropperStatements) => {
        const paramsIsNotExists = Object.keys(params).some((k) => (params as any)[k] !== (statements.current as any)[k]);

        if (!paramsIsNotExists) return;

        statements.current = { ...statements.current, ...params };

        onChangeState?.({ ...params, state: statements.current });
    }

    const getImageRatio = async () => {
        const { width, height, error } = await getImageSize(uri);

        if (error) return onImageError(error);

        width && height && setImageRatio(width / height);
    }

    const getLimits = (scale: number) => {
        const limitScale = Math.min(Math.max(scale, minScale), maxScale);
        const limitOffsetX = containerLayout.value.width * (limitScale - minScale) / 2 / limitScale - (containerLayout.value.width - imageLayout.value.width) / 2;
        const limitOffsetY = containerLayout.value.height * (limitScale - minScale) / 2 / limitScale - (containerLayout.value.height - imageLayout.value.height) / 2;

        return {
            limitScale,
            limitOffsetX,
            limitOffsetY
        };
    }

    const getMeasure = (ref: RefObject<any>): Promise<IImageCropperMeasure> => new Promise((resolve) => {
        ref.current?.measure?.((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            resolve({ x, y, width, height, pageX, pageY });
        });
    });

    const getImageSize = (uri: string): Promise<{ width?: number, height?: number, error?: any }> => new Promise(async (resolve) => {
        try {
            resolve(await ImageSize.getSize(uri));
        } catch (error) {
            resolve({ error });
        }
    });

    const setImageStatus = (value: IImageCropperImageStatus) => {
        imageStatusRef.current = value;
        setImageStatusState(value)
    }

    const cropImage = (): IImageCropperCropImageResolve => new Promise(async (resolve) => {
        const { cropData, error } = await getCropData();

        if (error) return resolve({ error });

        if (!cropData) return resolve({ error: "We cannot process your transaction because the area to be cropped cannot be calculated." });

        const handleCrop = onHandleCropData ? await onHandleCropData(cropData) : cropData;

        const imageUrl = await ImageEditor.cropImage(uri, handleCrop);

        return resolve({ uri: imageUrl });
    });

    const getCropData = (): Promise<{ cropData?: IImageCropperImageCropData, error?: any }> => new Promise(async (resolve) => {
        const { width, height, error } = await getImageSize(uri);

        if (!width || !height) return resolve({ error: "The dimensions of the uploaded image could not be calculated" });

        if (error) return resolve({ error });

        const containerMeasure = await getMeasure(containerRef);
        const imageMeasure = await getMeasure(imageRef);

        const horizontalRatio = width / imageMeasure.width;
        const verticalRatio = height / imageMeasure.height;

        const cropData: IImageCropperImageCropData = {
            offset: {
                x: horizontalRatio * Math.max(containerMeasure.pageX - imageMeasure.pageX, 0),
                y: verticalRatio * Math.max(containerMeasure.pageY - imageMeasure.pageY, 0),
            },
            size: {
                width: horizontalRatio * containerMeasure.width,
                height: verticalRatio * containerMeasure.height
            }
        };

        if (frame) {
            cropData.offset = {
                x: cropData.offset.x + horizontalRatio * frameRef.current.left.value,
                y: cropData.offset.y + verticalRatio * frameRef.current.top.value,
            };
            cropData.size = {
                width: horizontalRatio * frameRef.current.width.value,
                height: verticalRatio * frameRef.current.height.value,
            }
        }

        resolve({ cropData });
    });

    const onFixScaleAndTranslate = () => {
        if (!Object.keys(containerLayout.value).length || !Object.keys(imageLayout.value).length) return;

        const { limitScale, limitOffsetX, limitOffsetY } = getLimits(scale.value);

        const limitTranslateX = (mode === "center" && imageLayout.value.width * limitScale <= containerLayout.value.width) ?
            0 :
            Math.max(Math.min(limitOffsetX, translateX.value), -limitOffsetX);
        const limitTranslateY = (mode === "center" && imageLayout.value.height * limitScale <= containerLayout.value.height) ?
            0 :
            Math.max(Math.min(limitOffsetY, translateY.value), -limitOffsetY);

        scale.value = withSpring(limitScale);
        translateX.value = withSpring(limitTranslateX);
        translateY.value = withSpring(limitTranslateY);

        fixFrameContainer(limitScale);
    }


    const onFixDoubleTap = (event: Readonly<GestureEventPayload & TapGestureHandlerEventPayload>) => {
        const isMaxScale = scale.value === maxScale;

        const { limitScale, limitOffsetX, limitOffsetY } = getLimits(scale.value * 2);

        const newScale = isMaxScale ? 1 : limitScale;

        const eventImageX = ((imageLayout.value.width / 2) * (scale.value - minScale) - (translateX.value * scale.value) + event.x) / scale.value;
        const eventImageY = ((imageLayout.value.height / 2) * (scale.value - minScale) - (translateY.value * scale.value) + event.y) / scale.value;

        const isImageWidthSmaller = newScale * imageLayout.value.width < containerLayout.value.width;
        const isImageHeightSmaller = newScale * imageLayout.value.height < containerLayout.value.height;

        const newTranslateX = ((newScale - minScale) / newScale) * (imageLayout.value.width / 2 - eventImageX) + (event.x - eventImageX) / newScale;
        const newTranslateY = ((newScale - minScale) / newScale) * (imageLayout.value.height / 2 - eventImageY) + (event.y - eventImageY) / newScale;

        const limitTranslateX = (isMaxScale || isImageWidthSmaller) ? 0 : Math.max(Math.min(limitOffsetX, newTranslateX), -limitOffsetX);
        const limitTranslateY = (isMaxScale || isImageHeightSmaller) ? 0 : Math.max(Math.min(limitOffsetY, newTranslateY), -limitOffsetY);

        runOnJS(setIsDoubleZooming)(true);

        scale.value = withTiming(newScale);
        translateX.value = withTiming(limitTranslateX);
        translateY.value = withTiming(limitTranslateY, {}, (finished) => {
            finished && runOnJS(setIsDoubleZooming)(false);
        });

        fixFrameContainer(newScale);
    }

    const onTapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
        onEnd: (event) => runOnJS(onFixDoubleTap)(event)
    });

    const onPinchGestureEvent = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, IImageCropperPinchGestureContext>({
        onStart: (event, context) => {
            context.scale = scale.value;
            context.lastScale = 1;
        },
        onActive: (event, context) => {
            const offsetX = event.focalX - (imageLayout.value.width / 2);
            const offsetY = event.focalY - (imageLayout.value.height / 2);
            const offsetScale = context.lastScale - event.scale;

            translateX.value = translateX.value + (offsetScale * offsetX);
            translateY.value = translateY.value + (offsetScale * offsetY);
            scale.value = (context.scale * event.scale);

            context.lastScale = event.scale;
        },
        onEnd: () => runOnJS(onFixScaleAndTranslate)()
    });

    const onPanGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, IImageCropperPanGestureContext>({
        onStart: (event, context) => {
            context.translateY = translateY.value;
            context.translateX = translateX.value;
            context.scale = scale.value;
        },
        onActive: (event, context) => {
            translateX.value = context.translateX + event.translationX / context.scale;
            translateY.value = context.translateY + event.translationY / context.scale;
        },
        onEnd: () => runOnJS(onFixScaleAndTranslate)()
    });

    const fixFrameContainer = (scale: number) => {
        if (!frame || !Object.keys(frameRef.current).length) return;

        const oldFrameContainerWidth = frameContainerWidth?.value ?? imageLayout.value.width;
        const oldFrameContainerHeight = frameContainerHeight?.value ?? imageLayout.value.height;

        const newFrameContainerWidth = Math.min(containerLayout.value.width, imageLayout.value.width * scale);
        const newFrameContainerHeight = Math.min(containerLayout.value.height, imageLayout.value.height * scale);

        const frameLeft = frameRef.current.left.value + (newFrameContainerWidth - oldFrameContainerWidth) / 2;
        const limitFrameLeft = Math.max(Math.min(newFrameContainerWidth - frameRef.current.width.value, frameLeft), 0);
        const frameTop = frameRef.current.top.value + (newFrameContainerHeight - oldFrameContainerHeight) / 2;
        const limitFrameTop = Math.max(Math.min(newFrameContainerHeight - frameRef.current.height.value, frameTop), 0);
        const frameWidth = frameRef.current.width.value;
        const limitFrameWidth = Math.min(newFrameContainerWidth, frameWidth);
        const frameHeight = frameRef.current.height.value;
        const limitFrameHeight = Math.min(newFrameContainerHeight, frameHeight);

        const frameRatio = frameRef.current.width.value / frameRef.current.height.value;

        frameRef.current.width.value = withTiming(Math.min(limitFrameWidth, limitFrameHeight * frameRatio));
        frameRef.current.height.value = withTiming(Math.min(limitFrameHeight, limitFrameWidth / frameRatio));
        frameRef.current.top.value = withTiming(limitFrameTop + (oldFrameContainerHeight - newFrameContainerHeight) / 2, undefined, () => {
            frameContainerHeight.value = newFrameContainerHeight;
            frameRef.current.top.value = limitFrameTop;
        });
        frameRef.current.left.value = withTiming(limitFrameLeft + (oldFrameContainerWidth - newFrameContainerWidth) / 2, undefined, () => {
            frameContainerWidth.value = newFrameContainerWidth;
            frameRef.current.left.value = limitFrameLeft;
        });
    }

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const layout = event.nativeEvent.layout;

        containerLayout.value = layout;
    }

    const onImageLayout = () => new Promise(async (resolve) => {
        const layout = await getMeasure(imageRef);

        translateY.value = 0;
        translateX.value = 0;

        layout.width = layout.width / scale.value;
        layout.height = layout.height / scale.value;

        scale.value = 1;

        imageLayout.value = layout;

        frameContainerWidth.value = Math.min(layout.width, containerLayout.value.width);
        frameContainerHeight.value = Math.min(layout.height, containerLayout.value.height);

        frameRef.current?.resetFrame?.();

        resolve(true);
    });

    const onImageLoad = async () => {
        if (imageStatusRef.current?.isLoaded) return;

        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;

        await onImageLayout();

        setImageStatus({ isLoaded: true, error: undefined });
    }

    const onImageError = (event: IImageCropperImageError) => {
        setImageStatus({ isLoaded: false, error: event });

        console.warn("Could not load image");
    };

    const onPinchHandlerStateChange = ({ nativeEvent }: HandlerStateChangeEvent) => {
        const state = nativeEvent.state;

        (state === State.FAILED) && onFixScaleAndTranslate();

        changeStatements({ isZooming: state === State.ACTIVE ? true : false });
    }

    const onPanHandlerStateChange = ({ nativeEvent }: HandlerStateChangeEvent) => {
        const state = nativeEvent.state;

        changeStatements({ isDragging: state === State.ACTIVE ? true : false });
    }

    const canVisible = imageStatus?.isLoaded && imageRatio;

    const rWrapperStyle = useAnimatedStyle(() => ({
        opacity: withTiming(canVisible ? 1 : 0, { duration: 500 })
    }));

    const rImageStyle = useAnimatedStyle(() => {
        const style: ImageStyle = {
            transform: [
                { scale: scale.value },
                { translateX: translateX.value },
                { translateY: translateY.value },
            ]
        }

        if (!imageRatio || !containerLayout.value.width) return style;

        style.aspectRatio = imageRatio;

        const containerRatio = containerLayout.value.width / containerLayout.value.height;

        if (mode === "center") {
            style.width = imageRatio > containerRatio ?
                containerLayout.value.width :
                containerLayout.value.height * imageRatio;
            style.height = imageRatio > containerRatio ?
                containerLayout.value.width / imageRatio :
                containerLayout.value.height;
        } else {
            style.width = imageRatio > containerRatio ?
                containerLayout.value.height * imageRatio :
                containerLayout.value.width;
            style.height = imageRatio > containerRatio ?
                containerLayout.value.height :
                containerLayout.value.width / imageRatio;
        }

        return style;
    });

    const rFrameContainerStyle = useAnimatedStyle(() => {
        const style: ViewStyle = {};

        if (mode === "cover") {
            containerLayout.value.width && (style.width = containerLayout.value.width);
            containerLayout.value.height && (style.height = containerLayout.value.height);
        } else {
            frameContainerWidth.value && (style.width = frameContainerWidth.value);
            frameContainerHeight.value && (style.height = frameContainerHeight.value);
        }

        return style;
    });

    return {
        mainProps: props,
        containerRef,
        imageRef,
        frameRef,
        frameContainerRef,
        isDoubleZooming,
        imageRatio,
        imageStatus,
        canVisible,
        frameContainerWidth,
        frameContainerHeight,
        scale,
        translateX,
        translateY,
        rWrapperStyle,
        rImageStyle,
        rFrameContainerStyle,
        cropImage,
        onContainerLayout,
        onImageLayout,
        onImageLoad,
        onImageError,
        onTapGestureEvent,
        onPinchGestureEvent,
        onPanGestureEvent,
        onPinchHandlerStateChange,
        onPanHandlerStateChange
    }
};

export default useHook;