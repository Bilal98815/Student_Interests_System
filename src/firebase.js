import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyAw8kLbs3GacTzfT0RDLRhBr8EO5WeReso',
  authDomain: 'student-interests-system.firebaseapp.com',
  projectId: 'student-interests-system',
  storageBucket: 'student-interests-system.appspot.com',
  messagingSenderId: '783534879657',
  appId: '1:783534879657:web:2f24af436fc6760069cab8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
export default db;
