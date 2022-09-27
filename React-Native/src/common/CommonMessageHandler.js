import { Alert } from 'react-native';

const ALERT_CONSTANT = {
    TITLE: "Uh-oh"
};

export function alert() {
    let args = arguments;
    if (args.length == 1) {
        let val = args[0];
        return Alert.alert(ALERT_CONSTANT.TITLE, val);
    } else if (args.length == 2) {
        let val = args[0];
        let val2 = args[1];
        return Alert.alert(val, val2);
    }
};

const ERROR_BY_KEY = {
    E_PERMISSION_MISSING: "Camera permission is required for this feature.",
    E_PICKER_NO_CAMERA_PERMISSION: "Camera permission is required for this feature.",
    E_PICKER_CANCELLED: "no alert",
    E_CROPPER_IMAGE_NOT_FOUND: "Oops, something went wrong, please try again with a different image.",
    E_NO_IMAGE_DATA_FOUND: "Oops, something went wrong, please try again with a different image.",
    E_ERROR_WHILE_CLEANING_FILES: "Oops, something went wrong, please try again.",
    E_CANNOT_SAVE_IMAGE: "Oops, the image could not be saved. The phone storage may be full.",
    E_CANNOT_PROCESS_VIDEO: "Oops, the video could not be processed. The phone storage may be full.",
};

export const errorOutputByKey = key => {
    return ERROR_BY_KEY[key] || false;
};

const ERROR_BY_MESSAGE = {
    "Unable to fetch location within 5.0s.": "Oops, we could not retrieve your location information.",
    "User denied access to location services.": "Without permission to access to your location, the app funtionality will be limited.",
    "Location permission was not granted.": "Without permission to access to your location, the app funtionality will be limited.",
};

export const errorOutputByMessage = message => {
    return ERROR_BY_MESSAGE[message] || false;
};