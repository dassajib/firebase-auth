import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

const firebaseInitalizeApp = () => {
    initializeApp(firebaseConfig);
}

export default firebaseInitalizeApp;