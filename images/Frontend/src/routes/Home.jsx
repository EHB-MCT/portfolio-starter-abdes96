import  { useState, useEffect } from "react";
import Artwork from "../classes/Artwork";
import { Link } from "react-router-dom";

import "./styles/Home.css";

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [newArtworkName, setNewArtworkName] = useState("");
  const [newArtworkDescription, setNewArtworkDescription] = useState("");
  const [newArtworkImage, setNewArtworkImage] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("http://localhost/artworks/");
        if (!response.ok) {
          throw new Error("Failed to fetch artwork data");
        }
        const data = await response.json();

        // Use map to transform data into Artwork objects
        const artworkObjects = data.map(
          (artwork, index) =>
            new Artwork({
              name: artwork.name,
              description: artwork.description,
              image: artwork.image,
              user_id: artwork.user_id,
              key: index.toString(),
            })
        );

        setArtworks(artworkObjects);
      } catch (error) {
        console.error("Error fetching artwork data:", error.message);
      }
    };

    // Check if user is identified based on the presence of a user ID in local storage
    const isAuthenticated = localStorage.getItem("user_ID") !== null;
    setUserAuthenticated(isAuthenticated);

    // Fetch artworks when the component mounts
    fetchArtworks();
  }, []);

  const openUploadModal = () => {
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleUpload = () => {
    const storedUserId = localStorage.getItem("user_ID");

    if (!storedUserId) {
      console.error("User ID not found in local storage");
      window.location.reload();
      return;
    }

    const artworkData = {
      name: newArtworkName,
      description: newArtworkDescription,
      image: newArtworkImage,
      user_id: parseInt(storedUserId, 10),
    };

    fetch("http://localhost/artworks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artworkData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error == "User not found.") {
          console.error("User not found.");
          localStorage.clear();
          window.location.reload();
        } else if (data.message === "Artwork created successfully") {
          window.location.reload();
        } else {
          console.error("Error uploading artworks:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error uploading artwork:", error);
      });

    closeUploadModal();
  };

  

  return (
    <div className="container">
      <div className="head">
        <h1>Artworks</h1>
      </div>
      {userAuthenticated ? (
        <button className="upload-button" onClick={openUploadModal}>
          Upload a Artwork
        </button>
      ) : (
        <Link to="/login">
          <button className="login-button">Login to Upload Artwork</button>
        </Link>
      )}

      {isUploadModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Artwork</h2>
            <label htmlFor="newArtworkName">Name:</label>
            <input
              type="text"
              id="newArtworkName"
              value={newArtworkName}
              onChange={(e) => setNewArtworkName(e.target.value)}
            />

            <label htmlFor="newArtworkDescription">Description:</label>
            <textarea
              id="newArtworkDescription"
              value={newArtworkDescription}
              onChange={(e) => setNewArtworkDescription(e.target.value)}
            />

            <label htmlFor="newArtworkImage">Image URL:</label>
            <input
              type="text"
              id="newArtworkImage"
              value={newArtworkImage}
              onChange={(e) => setNewArtworkImage(e.target.value)}
            />

            <button id="uploadbtn" onClick={handleUpload}>
              Upload
            </button>
            <button id="uploadbtn" onClick={closeUploadModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="artwork-container">
        {artworks.map((artwork, index) => (
          <div key={index} className="artwork-card">
            <img src={artwork.image} alt={artwork.name} />
            <h3>{artwork.name}</h3>
            <p>{artwork.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
