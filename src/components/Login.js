import { React,useState, useEffect } from "react";
import { auth, googleProvider} from "../config/firebase.js";
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, getAuth } from "firebase/auth";
import './Login.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    console.log(auth?.currentUser?.email);
    const signIn = async (e) =>{
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user',auth?.currentUser || null);
            setTimeout(() => {
                toast.success("Signed in successfully!!!")
            }, 1000);
            
            navigate('/reviews', { replace: true });
            
        }catch(err){
            console.error(err);
            toast.error("Sign in failed!!!")

        }
    };
    const signInWithGoolge = async(e)=>{
        e.preventDefault();
        try{
            await signInWithPopup (auth, googleProvider);
            localStorage.setItem('user',auth?.currentUser || null);
            setTimeout(() => {
                toast.success("Signed in successfully!!!")
            }, 1000);
            navigate('/reviews', { replace: true });

        }catch(err){
            console.error(err);
            toast.error("Sign in failed!!!")

        }
    }
    

    return (
        <>
        <div className="form-div">
            <ToastContainer />
            
            <form>
                <h1 className="login-head">Login</h1>
                <div className="login-content">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" required autoComplete="on" placeholder="abc@gmail.com"
                onChange={(e)=> setEmail(e.target.value)}/>
                </div>
                <div className="login-content">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required autoComplete="on"
                onChange={(e)=> setPassword(e.target.value)}/>
                </div>
                <button onClick={(e)=>signIn(e)} className="siginIn-btn">Submit</button>
                <button onClick={(e)=>signInWithGoolge(e)}>Sign In with google</button>
            </form>
            </div>
        </>
    );
}
export default Login