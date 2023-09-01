/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  Alert,
  Linking,
} from "react-native";

import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./store";
import { NavigationContainer } from "@react-navigation/native";
import { Config } from "./utils/Config";
import AppNavigation from "./navigations/AppNavigation";
import RNBootSplash from "react-native-bootsplash";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import DeviceInfo from "react-native-device-info";

const redirectURL =
  Platform.OS === "ios"
    ? "https://apps.apple.com/us/app/uetrack-hospitality/id6446872698"
    : "http://play.google.com/store/apps/details?id=com.uetrack.hospitality";

const App = () => {
  useEffect(() => {
    /**
     * checking whether new version is available in the store or not
     * App update Prompt
     */
    const inAppUpdates = new SpInAppUpdates(
      false // isDebug
    );
    let currentAppVersion = DeviceInfo.getVersion();
    inAppUpdates
      .checkNeedsUpdate({ curVersion: currentAppVersion })
      .then((result: NeedsUpdateResponse) => {
        if (result.shouldUpdate) {
          Alert.alert(
            "New Update Available!",
            "Entrypass recommends that you update to the latest version.",
            [
              {
                text: "Later",
                style: "cancel",
              },
              {
                text: "Update Now",
                onPress: () => Linking.openURL(redirectURL),
              },
            ]
          );
        }
      });

    /**
     * Push Notification listioner
     */

    const init = async () => {};
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      PushNotification.createChannel(
        {
          channelId: "1", // (required)
          channelName: "EntryPass", // (required)
          foreground: true,
          playSound: true, // (optional) default: true
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

      PushNotification.localNotification({
        channelId: "1",
        message: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
        foreground: true,
        largeIcon: "",
        smallIcon: "entrypasslauncher",
      });
    });
    //unsubscribe();
    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
    //return () => unsubscribe();
  }, []);

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
