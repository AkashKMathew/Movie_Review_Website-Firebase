import React from "react";
import { useState, useEffect } from "react";
import { db, auth, storage } from "../config/firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./Update.css";

const Update = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie || null;
  const [add, setAdd] = useState(null);
  useEffect(() => {
    const addValue = localStorage.getItem('add');
    console.log('Value from localStorage:', addValue);
    setAdd(addValue);
    console.log(add);
  }, [])
  
  
  
  // const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [updateName, setUpdateName] = useState({});
  const moviesCollectionRef = collection(db, "movies");
  // const [updateName, setUpdateName] = useState({});
  const submitMovieData = async (e) => {
    e.preventDefault();

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
      // console.log("hii")
      toast.success("New movie added!!!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add the movie!!!");
    }
    setFileUpload("");
  };
  const updateMovie = async (id,e) => {
    e.preventDefault();
    const data = await getDocs(moviesCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const foundMovieDetails = Object.values(filteredData).find(
      (movie) => movie.id === id
    );

    // console.log(foundMovieDetails["imageURL"]);
    const prevImgURL = foundMovieDetails["imageURL"];
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
      setTimeout(() => {
        toast.success("Movie details updated!!!");
      }, 1000);
      
      navigate(-1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update the movie details!!!");
    }
    setFileUpload("");
  };
  return (
    <>
      {add==='1' ? (
        <div className="form-div">
          <ToastContainer />
          <form className="update-form">
            <div className="form-content">
              <label>Movie Name:</label>
              <input
                type="text"
                placeholder="Interstellar"
                onChange={(e) =>
                  setUpdateName((prevUpdateName) => ({
                    ...prevUpdateName,
                    [itemId]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-content">
              <label>
                Movie Poster :
                <input
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files[0])}
                />
              </label>
            </div>
            <button
              onClick={(e) => updateMovie(itemId,e)}>
              Update
            </button>
          </form>
        </div>
      ) : (
        <div className="form-div">
          <ToastContainer />
          <form>
            <div className="form-content">
              <label>Movie Name:</label>
              <input
                type="text"
                placeholder="Interstellar"
                onChange={(e) => setNewMovieName(e.target.value)}
                required
              />
            </div>
            <div className="form-content">
              <label>Release year:</label>
              <input
                placeholder="Release Date"
                type="number"
                onChange={(e) => setNewReleaseDate(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>
                Received Oscar
                <input
                  type="checkbox"
                  checked={newMovieOscar}
                  onChange={(e) => setNewMovieOscar(e.target.checked)}
                />
              </label>
            </div>
            <div className="form-content">
              <label>
                Movie Poster :
                <input
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files[0])}
                  required
                />
              </label>
            </div>
            <br />
            <button onClick={(e)=>submitMovieData(e)}>Submit</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Update;
