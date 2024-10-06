importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyB3ORPRhiO7KdynHVBvfOtC1sT6ttWqkZ0',
  authDomain: 'manh-shop-d116c.firebaseapp.com',
  projectId: 'manh-shop-d116c',
  storageBucket: 'manh-shop-d116c.appspot.com',
  messagingSenderId: '669097405316',
  appId: '1:669097405316:web:193079279467da8beb0bd1',
  measurementId: 'G-MBL2S58W6E'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

