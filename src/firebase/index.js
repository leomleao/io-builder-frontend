import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from 'Constants/defaultValues';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.firestore();

export { auth, database, firebase };
