import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyB3ORPRhiO7KdynHVBvfOtC1sT6ttWqkZ0',
  authDomain: 'manh-shop-d116c.firebaseapp.com',
  projectId: 'manh-shop-d116c',
  storageBucket: 'manh-shop-d116c.appspot.com',
  messagingSenderId: '669097405316',
  appId: '1:669097405316:web:193079279467da8beb0bd1',
  measurementId: 'G-MBL2S58W6E'
}

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig)

export default fireApp
