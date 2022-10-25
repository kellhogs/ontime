import { serverURL } from 'common/api/apiConstants';
import { io } from 'socket.io-client';

const socket = io(serverURL, { transports: ['websocket'] });
const subscriptions = new Set();

export function subscribeOnce<T>(key: string, callback: (data: T) => void) {
  if (subscriptions.has(key)) {
    return;
  }

  socket.emit(`get-${key}`);
  socket.on(key, callback);
}

export default socket;
