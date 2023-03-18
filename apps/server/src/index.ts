import { startDb, startIntegrations, startOSCServer, startServer } from './app.js';

async function startOntime() {
  try {
    console.log('Starting Ontime')
    console.log('Loading DB')
    await startDb();
    console.log('Starting Server')
    await startServer();
    console.log('Starting OSC Server')
    await startOSCServer();
    console.log('Starting Integrations')
    await startIntegrations();
  } catch (error) {
    console.log('Error starting Ontime');
    console.log(error);
  }
}

startOntime();
