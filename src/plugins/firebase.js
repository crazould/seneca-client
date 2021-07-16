import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyA572iAGXuYzK5Nuca3lazd-3rvuepElVg",
    authDomain: "seneca-project-management-tool.firebaseapp.com",
    databaseURL: "https://seneca-project-management-tool-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "seneca-project-management-tool",
    storageBucket: "seneca-project-management-tool.appspot.com",
    messagingSenderId: "167806167502",
    appId: "1:167806167502:web:b76e838f8393b1fceb639f",
    measurementId: "G-7DVBH3S1EC"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  window.Database = firebase.database()
  window.StorageRef = firebase.storage().ref()