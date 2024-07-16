// Initialize Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {getStorage} from "@firebase/storage"
const config = {
  apiKey: "AIzaSyDIAQat6BiMvf-tFNomBJt19k9318U4QUg",
  authDomain: "zenstudy-d4c4c.firebaseapp.com",
  projectId: "zenstudy-d4c4c",
  storageBucket: "zenstudy-d4c4c.appspot.com",
  messagingSenderId: "406542645075",
  appId: "1:406542645075:web:216c82f54462d35a3713a6",
  measurementId: "G-C4MW5RMTWW"

}
firebase.initializeApp(config);
const analytics = getStorage(firebase.initializeApp(config))
export { firebase, analytics }


    