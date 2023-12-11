import React from "react";
import { useState, useEffect } from "react";
import { db, storage, auth } from "../config/firebase.js";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./Reviews.css";

const Reviews = () => {
  const [movieList, setMovieList] = useState([]);

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
    // console.log(auth?.currentUser)
    localStorage.setItem('add',0);
  }, []);
  const deleteMovie = async (id, prevImgURL) => {
    const movieDoc = doc(db, "movies", id);
    const fileName = decodeURIComponent(
      new URL(prevImgURL).pathname.split("/").pop()
    );
    try {
      await deleteDoc(movieDoc);
      const oldImageRef = ref(storage, `${fileName}`);
      await deleteObject(oldImageRef);
      toast.success("Movie deleted!!!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete the movie!!!");
    }
    getMovieList();
  };
  const setAddValue = (value) =>{
    localStorage.setItem('add',value);
  }

  return (
    <div className="review-container">
      <ToastContainer />
        <div className="cards">
          <Link to="/add" className="add-btn">
            <button onClick={() => setAddValue(0)}>Add Review</button>
          </Link>
          {movieList.map((movie) => (
            <div className="card">
              <img className="movie-img" src={movie.imageURL} alt="img"></img>
              <h1>{movie.name}</h1>
              <p className="year">Year: {movie.releaseDate}</p>
              <div className="card-bottom">
              <button onClick={() => deleteMovie(movie.id, movie.imageURL)}>
                Delete
              </button>
              <Link to={`/update/${movie.id}`} onClick={() => setAddValue(1)}>
                <button >Update</button>
              </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reviews;
