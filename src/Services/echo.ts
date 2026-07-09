import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './api';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  authEndpoint: `${import.meta.env.VITE_BACKEND_URL}/broadcasting/auth`,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel: { name: string }) => {
    return {
      authorize(socketId: string, callback: (error: Error | null, data: any) => void) {
        api.post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name,
        })
          .then(response => {
            callback(null, response.data);
          })
          .catch(error => {
            callback(error, null);
          });
      },
    };
  },
});
