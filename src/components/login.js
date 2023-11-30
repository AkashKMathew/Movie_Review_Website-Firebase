import { React,useState } from "react";
import { auth, googleProvider} from "../config/firebase.js";
import { createUserWithEmailAndPassword, signInWithPopup,signOut } from "firebase/auth";
import './login.css'
function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    // console.log(auth?.currentUser?.email);
    const signIn = async (e) =>{
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Logged in")
            
        }catch(err){
            console.error(err);
        }
    };
    const signInWithGoolge = async(e)=>{
        e.preventDefault();
        try{
            await signInWithPopup (auth, googleProvider);
            console.log("Logged in")

        }catch(err){
            console.error(err);
        }
    }
    const logOut = async()=>{
        try{
            await signOut (auth);
            console.log("Logged out")
        }catch(err){
            console.error(err);
        }
    }

    return (
        <>
            <form>
                <h1>Login</h1>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" required autoComplete="on"
                onChange={(e)=> setEmail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required autoComplete="on"
                onChange={(e)=> setPassword(e.target.value)}/>
                <button onClick={(e)=>signIn(e)}>SignIn</button>
                <button onClick={(e)=>signInWithGoolge(e)}>Sign In with google</button>
                <button onClick={logOut} >SignOut</button>
            </form>
        </>
    );
}
export default Login