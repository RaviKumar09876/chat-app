// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyBdBlfCHQ61LKVcFeyrciF04sd-2PuOrNs",
  authDomain: "chat-app-gs-1dc67.firebaseapp.com",
  projectId: "chat-app-gs-1dc67",
  storageBucket: "chat-app-gs-1dc67.appspot.com",
  messagingSenderId: "475751200137",
  appId: "1:475751200137:web:04bc265428359112ca5d58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)


const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"user",user.uid),{
          id:user.uid,
          username:username.toLowerCase(),
          email,
          name:"",
          avatar:"",
          bio:"Hey, There i am using chat app",
          lastseen:Date.now()

        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })

    } catch (error) {
        console.error(error)
        toast.error(error.code .split('/')[1].split('-').join(""));

    }
    
}
const login = async (email,password) => {
  try{
    await signInWithEmailAndPassword (auth,email,password);
  }catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(""));

  
  }

}

const logout = async() => {
  try {
    await signOut(auth)


  } catch (error){
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(""));

  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error ("Enter your email");
    return null;
    
  }
  try {
    const userRef = collection (db,'users');
    const q = query(userRef,where("email","==",email))
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
      
    }
    else{
      toast.error("Email doesnot exists")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message)
    
  }
}
export {signup,login,logout,auth,db,resetPass}