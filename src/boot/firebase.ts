// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD09vv-Jq4UiUp3nO_YO6eOGTtjgyHTZVw',
  authDomain: 'freedom-project-b2934.firebaseapp.com',
  projectId: 'freedom-project-b2934',
  storageBucket: 'freedom-project-b2934.appspot.com',
  messagingSenderId: '263425555363',
  appId: '1:263425555363:web:caf36b18e37d0935cf3816',
  measurementId: '${config.measurementId}'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {
  app,
  analytics
}