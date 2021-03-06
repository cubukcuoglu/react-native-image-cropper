import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "black"
    },
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0
    },
    frameImageSize: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    frameContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    frameWrapper: {
        width: "100%",
        aspectRatio: 3,
    },
    line: {
        position: "absolute",
    },
    linesWrapper: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    loading: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
});