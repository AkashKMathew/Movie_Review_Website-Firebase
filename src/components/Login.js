import { React,useState } from "react";
import { auth, googleProvider} from "../config/firebase.js";
import { createUserWithEmailAndPassword, signInWithPopup,signOut } from "firebase/auth";
import './Login.css'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    // console.log(auth?.currentUser?.email);
    const signIn = async (e) =>{
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Signed in successfully!!!")
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
            toast.success("Signed in successfully!!!")
            navigate('/reviews', { replace: true });

        }catch(err){
            console.error(err);
            toast.error("Sign in failed!!!")

        }
    }
    const logOut = async()=>{
        try{
            await signOut (auth);
            toast.success("Signed out successfully!!!")
            // navigate('/', { replace: true });
        }catch(err){
            console.error(err);
            toast.error("Sign out failed!!!")
        }
    }

    return (
        <>
            <ToastContainer />
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