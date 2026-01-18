import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messagingInstance;

export const initFirebaseMessaging = () => {
  if (!firebaseConfig.apiKey) return null;
  const app = initializeApp(firebaseConfig);
  messagingInstance = getMessaging(app);
  return messagingInstance;
};

export const requestNotificationToken = async () => {
  if (!messagingInstance) {
    initFirebaseMessaging();
  }
  if (!messagingInstance) return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  return getToken(messagingInstance, { vapidKey });
};

export const listenForForegroundMessages = (callback) => {
  if (!messagingInstance) {
    initFirebaseMessaging();
  }
  if (!messagingInstance) return () => {};
  return onMessage(messagingInstance, callback);
};
