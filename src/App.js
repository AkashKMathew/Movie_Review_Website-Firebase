import "./App.css";
import Login from "./components/login.js";
import { useState, useEffect } from "react";
import { db, auth,storage } from "./config/firebase.js";
import { getDocs, collection, addDoc, deleteDoc, doc,updateDoc } from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");
  const [updateName, setUpdateName] = useState({})

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc)
    getMovieList()
  }
  const updateMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    const updatedName = updateName[id] || "";
    await updateDoc(movieDoc,{name:updatedName})
    getMovieList()
  }

  const submitMovieData = async () => {
    if(!fileUpload) return;
    console.log(newMovieName, newMovieOscar, newReleaseDate);
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    try {
      const snapshot = await uploadBytes(filesFolderRef, fileUpload);
      const imgURL = await getDownloadURL(snapshot.ref);
      await addDoc(moviesCollectionRef, {
        name: newMovieName,
        releaseDate: newReleaseDate,
        receivedOscar: newMovieOscar,
        imageURL:imgURL,
        userId:auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };
    

  return (
    <div className="App">
      <Login />

      <div>
        <label>Movie Name:</label>
        <input
          placeholder="Interstellar"
          onChange={(e) => setNewMovieName(e.target.value)}
          required
        />
        <label>Release year:</label>
        <input
          placeholder="Release Date"
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          required
        />
        <label>Received Oscar
        <input
          type="checkbox"
          checked={newMovieOscar}
          onChange={(e) => setNewMovieOscar(e.target.checked)}
        />
        </label>
        <input type="file" 
        onChange={(e)=>setFileUpload(e.target.files[0])}
        required
        /><br/>
        <button onClick={submitMovieData}>Submit</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <img src={movie.imageURL} alt="img"></img>
            <h1 style={{ color: movie.receivedOscar ? "green" : "red" }}>
              {movie.name}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={()=>deleteMovie(movie.id)}>Delete Movie</button>
            <input placeholder="New movie name" onChange={
              (e)=>setUpdateName((prevUpdateName)=>({
                ...prevUpdateName,
                [movie.id]:e.target.value,
                }))}/>
            <button onClick={()=>{updateMovie(movie.id);}}>Update</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
