// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {getFirestore,addDoc,collection} from 'firebase/firestore'
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA9ZFrAmJsv5KIN7gwRfm3JTrqD6U77itQ",
  authDomain: "netflix-clone-db97e.firebaseapp.com",
  projectId: "netflix-clone-db97e",
  storageBucket: "netflix-clone-db97e.firebasestorage.app",
  messagingSenderId: "1014798401383",
  appId: "1:1014798401383:web:0a61322e07096808ddb9c2"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup = async (name, email, password) => {
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

   
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      
    });


  } catch (error) {
    console.error("Signup error:", error);
toast.error(error.code.split('/')[1].split('-').join(" "));    
  
    
  }
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
toast.error(error.code.split('/')[1].split('-').join(" "));    
}

}

const logout = () => {
    signOut(auth);  
}
export {auth,db,signup,login,logout}