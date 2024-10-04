const { initializeApp } = require("firebase/app")
const { getFirestore } = require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyCMQ68UlqQQQB4cPt9maSmFNLu0OgJqRW8",
  authDomain: "pruebatecnicabtg-ad37d.firebaseapp.com",
  projectId: "pruebatecnicabtg-ad37d",
  storageBucket: "pruebatecnicabtg-ad37d.appspot.com",
  messagingSenderId: "595737248554",
  appId: "1:595737248554:web:c79b94e265ab1c94631453",
  measurementId: "G-NQ8T6S01Q0",
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

module.exports = { db }
