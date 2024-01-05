import React, { useState, useEffect } from "react";
import Artwork from "../classes/Artwork";
import "./styles/Home.css";

const Home = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("http://localhost/artworks/");
        if (!response.ok) {
          throw new Error("Failed to fetch artwork data");
        }
        const data = await response.json();

        // Use map to transform data into Artwork objects
        const artworkObjects = data.map((artwork, index) => (
          new Artwork({
            name: artwork.name,
            description: artwork.description,
            image: artwork.image,
            user_id: artwork.user_id,
            key: index.toString(),
          })
        ));

        setArtworks(artworkObjects);
      } catch (error) {
        console.error("Error fetching artwork data:", error.message);
      }
    };

    // Invoke the fetchArtworks function
    fetchArtworks();
  }, []); 

  return (
    <div className="container">
      <div className="head">
        <h1>Artworks</h1>
      </div>
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
