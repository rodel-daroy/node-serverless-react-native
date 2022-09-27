import MockAsyncStorage from 'mock-async-storage';
import { NativeModules as RNNativeModules } from "react-native";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const mockImpl = new MockAsyncStorage();
jest.mock('@react-native-community/async-storage', () => mockImpl);

RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
    State: { BEGAN: "BEGAN", FAILED: "FAILED", ACTIVE: "ACTIVE", END: "END" },
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),

};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
    forceTouchAvailable: false
};

jest.mock("react-native-reanimated", () => require('react-native-reanimated/mock'));

jest.mock('react-native-firebase', () => {
    return {
        messaging: jest.fn(() => {
            return {
                hasPermission: jest.fn(() => Promise.resolve(true)),
                subscribeToTopic: jest.fn(),
                unsubscribeFromTopic: jest.fn(),
                requestPermission: jest.fn(() => Promise.resolve(true)),
                getToken: jest.fn(() => Promise.resolve('myMockToken'))
            };
        }),
        notifications: jest.fn(() => {
            return {
                onNotification: jest.fn(),
                onNotificationDisplayed: jest.fn()
            };
        })
    };
});

jest.mock('@react-native-community/geolocation', () => {
    return {
        addListener: jest.fn(),
        getCurrentPosition: jest.fn(),
        removeListeners: jest.fn(),
        requestAuthorization: jest.fn(),
        setConfiguration: jest.fn(),
        startObserving: jest.fn(),
        stopObserving: jest.fn()
    };
});

jest.mock('react-native-fs', () => {
    return {
        mkdir: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        pathForBundle: jest.fn(),
        pathForGroup: jest.fn(),
        getFSInfo: jest.fn(),
        getAllExternalFilesDirs: jest.fn(),
        unlink: jest.fn(),
        exists: jest.fn(),
        stopDownload: jest.fn(),
        resumeDownload: jest.fn(),
        isResumable: jest.fn(),
        stopUpload: jest.fn(),
        completeHandlerIOS: jest.fn(),
        readDir: jest.fn(),
        readDirAssets: jest.fn(),
        existsAssets: jest.fn(),
        readdir: jest.fn(),
        setReadable: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
        read: jest.fn(),
        readFileAssets: jest.fn(),
        hash: jest.fn(),
        copyFileAssets: jest.fn(),
        copyFileAssetsIOS: jest.fn(),
        copyAssetsVideoIOS: jest.fn(),
        writeFile: jest.fn(),
        appendFile: jest.fn(),
        write: jest.fn(),
        downloadFile: jest.fn(),
        uploadFiles: jest.fn(),
        touch: jest.fn(),
        MainBundlePath: jest.fn(),
        CachesDirectoryPath: jest.fn(),
        DocumentDirectoryPath: jest.fn(),
        ExternalDirectoryPath: jest.fn(),
        ExternalStorageDirectoryPath: jest.fn(),
        TemporaryDirectoryPath: jest.fn(),
        LibraryDirectoryPath: jest.fn(),
        PicturesDirectoryPath: jest.fn(),
    };
});

jest.mock('react-native-image-picker', () => ({
}));

jest.mock('react-native-photoeditorsdk', () => {
    return {
        PESDK: {
            unlockWithLicense: jest.fn(),
        },
    }
});

jest.mock('@react-native-community/google-signin', () => {
    return {
        SIGN_IN_CANCELLED: jest.fn(),
    }
});

jest.mock('react-native-device-info', () => {
    return {
        __esModule: true,
        default: jest.fn(() => { })
    };
});

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('react-navigation-drawer', () => {
    return {
        createDrawerNavigator: jest.fn(),
    }
});

jest.mock('react-navigation-stack', () => {
    return {
        createStackNavigator: jest.fn(),
    }
});

jest.mock('react-navigation', () => {
    return {
        createAppContainer: jest.fn(),
        NavigationEvents : jest.fn(),
    }
});

jest.mock('./src/common/PeertalConstants', () => {
    return {
        CONSTANTS: {
            getTimeDifference:jest.fn(),
            IS_HIDE_WALLET_FEATURE: false,
            INCOGNITO_AVATAR: require('./src/assets/xd/incognito.png'),
            INCOGNITO_BACKGROUND: require('./src/assets/xd/header/Incognito_header.png'),
        }

    }
})