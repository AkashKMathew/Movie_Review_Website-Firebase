import React from 'react'
import { useState, useEffect } from "react";
import { db, storage } from "../config/firebase.js";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

function Reviews() {

    const [movieList, setMovieList] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");
  const [updateName, setUpdateName] = useState({});

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

  const updateMovie = async (id, prevImgURL) => {
    const movieDoc = doc(db, "movies", id);
    const updatedName = updateName[id] || "";
    try {
      await updateDoc(movieDoc, { name: updatedName });
      if (fileUpload) {
        const newMovieImg = ref(storage, `projectFiles/${fileUpload.name}`);
        const snapshot = await uploadBytes(newMovieImg, fileUpload);
        const imgURL = await getDownloadURL(snapshot.ref);
        await updateDoc(movieDoc, { imageURL: imgURL });
        const fileName = decodeURIComponent(
          new URL(prevImgURL).pathname.split("/").pop()
        );
        const oldImageRef = ref(storage, `${fileName}`);
        await deleteObject(oldImageRef);
      }
      toast.success("Movie details updated!!!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update the movie details!!!");
    }
    setFileUpload("");
    getMovieList();
  };
  return (
    <div>
      <ToastContainer />
        <Link to="/add"><button>Add Review</button></Link>
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
            <input
              placeholder="New movie name"
              onChange={(e) =>
                setUpdateName((prevUpdateName) => ({
                  ...prevUpdateName,
                  [movie.id]: e.target.value,
                }))
              }
            />
            <input
              type="file"
              onChange={(e) => setFileUpload(e.target.files[0])}
            />
            <br />
            <button
              onClick={() => {
                updateMovie(movie.id, movie.imageURL);
              }}>
              Update
            </button>
          </div>
        ))}
      </div> 
  )
}

export default Reviews