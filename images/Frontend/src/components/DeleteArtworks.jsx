import { useState, useEffect } from "react";

const DeleteButton = ({ artwork }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_ID");
    setUserId(storedUserId);
    userId;
  }, []);

  const handleDeleteClick = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleConfirmClick = () => {
    setConfirmDelete(false);

    const artworkId = artwork.id.toString();
    const userIdInteger = parseInt(userId, 10);

    fetch(`http://localhost/artworks/${artworkId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userIdInteger,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message === "Artwork deleted successfully") {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error deleting profile:", error);
      });
  };

  return (
    <div>
      <button onClick={handleDeleteClick}>
        {confirmDelete ? "Cancel" : "Delete"}
      </button>
      {confirmDelete && (
        <button onClick={handleConfirmClick}>Confirm Deletion</button>
      )}
    </div>
  );
};

export default DeleteButton;
