import React from "react";
import { useState } from "react";
import { db, auth, storage } from "../config/firebase.js";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Update() {
  const navigate = useNavigate();

  // const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");
  // const [updateName, setUpdateName] = useState({});
  const submitMovieData = async () => {
    
      if (!fileUpload) return;
      const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
  
      try {
        const snapshot = await uploadBytes(filesFolderRef, fileUpload);
        const imgURL = await getDownloadURL(snapshot.ref);
        await addDoc(moviesCollectionRef, {
          name: newMovieName,
          releaseDate: newReleaseDate,
          receivedOscar: newMovieOscar,
          imageURL: imgURL,
          userId: auth?.currentUser?.uid,
        });
        toast.success("New movie added!!!");
        navigate('/reviews', { replace: true });

      } catch (err) {
        console.error(err);
        toast.error("Failed to add the movie!!!");
      }
      setFileUpload("");
    };
  return (
    <div>
      <ToastContainer/>
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
        <label>
          Received Oscar
          <input
            type="checkbox"
            checked={newMovieOscar}
            onChange={(e) => setNewMovieOscar(e.target.checked)}
          />
        </label>
        <input
          type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
          required
        />
        <br />
        <button onClick={submitMovieData}>Submit</button>
      </div>
  );
}

export default Update;
