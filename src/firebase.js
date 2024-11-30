import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAGidwQwVfG7UlbkbYp6m628AcaFzbasq8',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

// Inicializa o Firebase (somente se ainda não estiver inicializado)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth(); 
export const db = firebase.firestore(); 
export default firebase;