import { IImageCropperStatements, IImageCropperImageStatus } from "./types";

export const DEFAULT_FRAME_BORDER_COLOR = "rgba(250, 250, 250, 1)"
export const DEFAULT_FRAME_LINE_WIDTH = 1;
export const DEFAULT_LINE_WIDTH = 1;
export const DEFAULT_LINE_COLOR = "rgba(250, 250, 250, .5)"
export const DEFAULT_LOADING_COLOR = "#FED600";
export const DEFAULT_LOADING_SIZE = "large";
export const DEFAULT_MODE = "center";
export const DEFAULT_IMAGE_STATE: IImageCropperImageStatus = { isLoaded: false, error: undefined };
export const DEFAULT_STATEMENTS: IImageCropperStatements = {
    image: DEFAULT_IMAGE_STATE,
    isDoubleZooming: false,
    isZooming: false,
    isDragging: false
}