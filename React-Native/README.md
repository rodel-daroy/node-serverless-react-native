# kuky2

React native 0.6x

Here is our tech stacks: react native, react, react-redux, react-navigation

Steps to first build

1. Git pull origin master
2. yarn install
3. Run on IOS: react-native run-ios
   Run on Android: react-native run-android

Steps to debug in simulator
In IOS simulator:
Ctrl + D: to show control
Ctrl + R: refresh or change to live load

in Android Simulator
R+R: refresh
Ctrl + M: to show control

Steps to debug in code
All screen sets are controlled inside /src/common/rootStack.js

Turn on screens to enable the screen Welcome->Stack (basic page before login)->Drawer (Drawer can route around functions pages)

Change initialRouteName to change initial route name

debug on Android:
-> run: cd android && ./gradlew clean
-> run: cd .. && react-native run-android

publish android: -> run: cd android && ./gradlew assembleRelease (to get apk) or ./gradlew bundleRelease (to get aab with smaller size)
publish ios: open xcode project on ios folder, increase version, then go to Product->archive-> publish and publish as normal ios app.
