import "./App.css";
import Login from "./components/login.js";
import { useState, useEffect } from "react";
import { db } from "./config/firebase.js";
import { getDocs, collection, addDoc, deleteDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);

  const moviesCollectionRef = collection(db, "movies");

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
  const submitMovieData = async () => {
    console.log(newMovieName, newMovieOscar, newReleaseDate);
    try {
      await addDoc(moviesCollectionRef, {
        name: newMovieName,
        releaseDate: newReleaseDate,
        receivedOscar: newMovieOscar,
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
