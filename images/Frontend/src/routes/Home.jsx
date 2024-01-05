import React, { useState, useEffect } from "react";
import Artwork from "../classes/Artwork";
import { Link } from "react-router-dom";
import "./styles/Home.css";
import User from "../classes/User";

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

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
    const isAuthenticated = localStorage.getItem("userID") !== null;
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

      {/* Modal */}
      {isUploadModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Artwork Modal</h2>
            <button onClick={closeUploadModal}>Close Modal</button>
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
