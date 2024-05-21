import { registerRootComponent } from 'expo';

import App from './src/app/App';
import { Auth0Provider } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage'


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// Polyfill localStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
    global.localStorage = {
        getItem: async (key) => await AsyncStorage.getItem(key),
        setItem: async (key, value) => await AsyncStorage.setItem(key, value),
        removeItem: async (key) => await AsyncStorage.removeItem(key),
    };
}

const RootComponent = () => (
    <Auth0Provider domain={"dev-yuycjzgs1yedljuh.us.auth0.com"} clientId={"BsaGs1glUYh2hklReySgL4VGvgivj4Ug"}>
        <App />
    </Auth0Provider>
);

registerRootComponent(RootComponent);
