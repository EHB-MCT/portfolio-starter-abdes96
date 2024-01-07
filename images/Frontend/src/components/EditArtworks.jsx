import  { useState } from "react";

const EditButton = ({ artwork }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState({
    name: artwork.name,
    description: artwork.description,
    image: artwork.image,
    user_id: artwork.user_id,
  });

  const handleEditClick = () => {
    setEditMode(true);
    console.log("Artwork details:", artwork);
  };

  const handleConfirmClick = async () => {
    const artworkId = artwork.id.toString();
    console.log("Artwork ID:", artworkId);

    fetch(`http://localhost/artworks/${artworkId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedArtwork),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message === "Artwork updated successfully") {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error updating artwork:", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedArtwork((prevArtwork) => ({
      ...prevArtwork,
      [name]: value,
    }));
  };

  return (
    <div>
      {!editMode ? (
        <button onClick={handleEditClick}>Edit</button>
      ) : (
        <>
          <input
            type="text"
            name="name"
            value={editedArtwork.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            value={editedArtwork.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="image"
            value={editedArtwork.image}
            onChange={handleInputChange}
          />
          <button onClick={handleConfirmClick}>Confirm</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default EditButton;
