import * as Unleash from "unleash-client";
const instance = Unleash.initialize({
    url: 'http://localhost:4242/api/',
    appName: 'react-app',
    // instanceId: 'my-unique-instance-id',
});
instance.on('ready', console.log.bind(console, 'ready'));
// required error handling when using instance directly
instance.on('error', console.error);
console.log("hola");