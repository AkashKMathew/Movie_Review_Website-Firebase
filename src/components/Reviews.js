import React from 'react'
import { useState, useEffect } from "react";
import { db, storage,auth } from "../config/firebase.js";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  
} from "firebase/firestore";
import {
  ref,
  deleteObject,
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

const Reviews = ({setAdd}) => {

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

  
  return (
    <div>
      <ToastContainer />
        <Link to="/add"><button onClick={()=>setAdd(0)}>Add Review</button></Link>
        {movieList.map((movie) => (
          <div>
            <img src={movie.imageURL} alt="img"></img>
            <h1 style={{ color: movie.receivedOscar ? "green" : "red" }}>
              {movie.name}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id, movie.imageURL)}>
              Delete Movie
            </button>
            <Link to={{pathname:`/update/${movie.id}`, state:{movie}}}><button onClick={()=>setAdd(1)}>Update</button></Link>
            
          </div>
        ))}
      </div> 
  )
}

export default Reviews