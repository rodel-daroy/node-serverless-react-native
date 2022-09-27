/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import NotificationHandler from './src/NotificationHandler';
import App from './src/App';


NotificationHandler();

AppRegistry.registerComponent(appName, () => App);
