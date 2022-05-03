import React, { FC, memo } from "react";
import { View } from "react-native";

import styles from "../style";
import { IImageCropperLinesProps } from "../types";
import { DEFAULT_LINE_COLOR, DEFAULT_LINE_WIDTH } from "../constants";

const Lines: FC<IImageCropperLinesProps> = memo((props) => {
    const {
        x,
        y,
        width = DEFAULT_LINE_WIDTH,
        color = DEFAULT_LINE_COLOR,
    } = props;

    const horizontal = Array(x).fill(0);
    const vertical = Array(y).fill(0);

    return (
        <>
            {horizontal.map((_, index) => (
                <View
                    key={index.toString()}
                    style={[
                        styles.line,
                        {
                            width,
                            height: "100%",
                            left: `${(100 / (x + 1) * (index + 1))}%`,
                            marginLeft: -width / 2,
                            backgroundColor: color
                        }
                    ]}
                    pointerEvents="none"
                />
            ))}
            {vertical.map((_, index) => (
                <View
                    key={index.toString()}
                    style={[
                        styles.line,
                        {
                            width: "100%",
                            height: width,
                            top: `${(100 / (y + 1) * (index + 1))}%`,
                            marginTop: -width / 2,
                            backgroundColor: color
                        }
                    ]}
                    pointerEvents="none" />
            ))}
        </>
    );
}, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));

export { Lines }