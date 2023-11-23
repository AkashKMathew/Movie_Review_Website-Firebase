import './App.css';
import Login from './components/login.js';
import { useState,useEffect } from 'react';
import {db} from "./config/firebase.js"
import { getDocs,collection } from 'firebase/firestore';

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db,"movies");
  useEffect(() => {
    const getMovieList=async()=>{
       
       try{
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
       }catch(err){
        console.error(err);
       }
    };

    getMovieList();
  }, []);
  
  
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
