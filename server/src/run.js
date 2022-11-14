import { startServer, startOSCServer } from './app.js';

startServer().then(startOSCServer);
