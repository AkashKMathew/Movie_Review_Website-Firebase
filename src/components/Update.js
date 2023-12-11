import React from "react";
import { useState } from "react";
import { db, auth, storage } from "../config/firebase.js";
import { collection, addDoc, updateDoc,doc,getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes,deleteObject, } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const Update = ({ add, setAdd }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state?.movie || null;
  // const [movieList, setMovieList] = useState([]);

  const [newMovieName, setNewMovieName] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieOscar, setNewMovieOscar] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [updateName, setUpdateName] = useState({});
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
      // console.log("hii")
      toast.success("New movie added!!!");
      navigate("/reviews", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add the movie!!!");
    }
    setFileUpload("");
  };
  const updateMovie = async (id) => {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const foundMovieDetails = Object.values(filteredData).find(
        movie => movie.id === id
      );
      
    // console.log(foundMovieDetails["imageURL"]);
    const prevImgURL =  foundMovieDetails["imageURL"];
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
      navigate('/reviews', { replace: true });
    } catch (e) {
      console.error(e);
      toast.error("Failed to update the movie details!!!");
    }
    setFileUpload("");
  };
  return (
    <>
    <ToastContainer/>
      {add ? (
        <div>
          <input
            placeholder="New movie name"
            onChange={(e) =>
              setUpdateName((prevUpdateName) => ({
                ...prevUpdateName,
                [itemId]: e.target.value,
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
              updateMovie(itemId);
            }}>
            Update
          </button>
        </div>
      ) : (
        <div>
          <ToastContainer />
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
      )}
    </>
  );
};

export default Update;
