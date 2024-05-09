import { registerRootComponent } from 'expo';

import App from './src/app/App';
import { Auth0Provider } from 'react-native-auth0';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const RootComponent = () => (
    <Auth0Provider domain={"dev-yuycjzgs1yedljuh.us.auth0.com"} clientId={"BsaGs1glUYh2hklReySgL4VGvgivj4Ug"}>
        <App />
    </Auth0Provider>
);

registerRootComponent(RootComponent);
