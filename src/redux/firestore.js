import '@firebase/firestore'; // 👈 Don't forget this!
import ReduxSagaFirebase from 'redux-saga-firebase';
import { firebase } from '../firebase';

const rsf = new ReduxSagaFirebase(firebase);

export default rsf;
