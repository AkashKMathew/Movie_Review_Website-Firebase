import "./App.css";
import Login from "./components/login.js";
import { useState, useEffect } from "react";
import { db, auth } from "./config/firebase.js";
import { getDocs, collection, addDoc, deleteDoc, doc,updateDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);

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
    console.log(newMovieName, newMovieOscar, newReleaseDate);
    try {
      await addDoc(moviesCollectionRef, {
        name: newMovieName,
        releaseDate: newReleaseDate,
        receivedOscar: newMovieOscar,
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
        <input
          placeholder="Movie Name"
          onChange={(e) => setNewMovieName(e.target.value)}
        />
        <input
          placeholder="Release Date"
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={newMovieOscar}
          onChange={(e) => setNewMovieOscar(e.target.checked)}
        />
        <label>Received Oscar</label>
        <button onClick={submitMovieData}>Submit</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
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
            <button onClick={()=>updateMovie(movie.id)}>Update</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
