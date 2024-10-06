import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../Config/Firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextprovider = (props)  => {
    
    const navigate = useNavigate();
    const [userData,setUserData] = useState(null);
    const [chatData,setChatData] = useState([]);
    const [messagesId, setMessagesId] = useState(null);
    const [messages,setMessages] = useState([]);
    const [chatUser,setChatUser] = useState(null);
    const [chatVisible,setChatVisible] = useState(false);

    const loadUserData = async (uid) => {
        try{
            const userRef = doc (db,'user',uid);
            const userSnap = await getDoc(userRef);
            const userData =  userSnap.data();
            setUserData(userData);
            if (userData.avatar && userData.name){
                navigate('/chat');
            }
            else{
                navigate ('/');
            }
             await updateDoc(userRef,{
                lastSeen:Date.now()
             })
             setInterval( async () =>{
                if (auth.chatUser) {
                    await updateDoc(userRef,{
                        lastSeen:Data.now()
                     })
                }

             }, 60000);

        } catch (error) {

        }
        
    }


    useEffect(()=>{
        if (userData){
            const chatRef = doc(db,'chats',userData.id);
            const unSub  = onSnapshot(chatRef,async (res) => {
                const chatItems = res.data().chatsData;
                // console.log(res.data());
                
                const tempData = [];
                for(const item of chatItems){
                    const userRef = doc(db,'user',item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    // console.log(userSnap.data())
                    tempData.push ({...item,userData})
                }
                // console.log(tempData)
                setChatData(tempData.sort((a,b)=>b.updatedAt - a.updatedAt))
                //   console.log(chatData);
            })
            return () => {
                unSub();
            }

        }
    },[userData])
    
    const value = {
        userData,setUserData,
        chatData,setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser,
        chatVisible,setChatVisible

    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
export default AppContextprovider