import React, { forwardRef, useImperativeHandle } from "react";

import useHook, { Context } from "../hook";
import { IImageCropperProps, IImageCropperImperativeHandle } from "../types";
import ImageZoom from './ImageZoom';

const Container = forwardRef<IImageCropperImperativeHandle, IImageCropperProps>((props, ref) => {
    const hook = useHook({ props });

    useImperativeHandle(ref, () => ({
        cropImage: hook.cropImage
    }));

    return (
        <Context.Provider value={{ ...hook }}>
            <ImageZoom />
        </Context.Provider>
    )
});

export { Container };