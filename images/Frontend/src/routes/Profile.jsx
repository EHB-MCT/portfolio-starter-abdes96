import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../classes/User";
import Artwork from "../classes/Artwork";
import "./styles/Profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [artworks, setArtworks] = useState([]);

  const fetchUserArtworks = async () => {
    try {
      const userId = localStorage.getItem("user_ID");

      const response = await fetch(`http://localhost/artworks/user/${userId}`);
      const data = await response.json();

      if (data.message === "No artworks found for the specified user.") {
        setArtworks([]);
      } else {
        const artworks = data.map((artworkData) => new Artwork(artworkData));
        console.log("Mapped Artworks:", artworks);
        setArtworks(artworks);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  useEffect(() => {
    // Retrieve user information from local storage
    const storedUserId = localStorage.getItem("user_ID");
    const storedUserName = localStorage.getItem("user_name");
    const storedUserEmail = localStorage.getItem("user_email");

    if (storedUserId && storedUserName && storedUserEmail) {
      // Instantiate User class with retrieved information
      const profile = new User(storedUserId, storedUserName, storedUserEmail);

      // Set the user state to use in the component
      setUser(profile);
    }

    fetchUserArtworks();
  }, []);

  const handleUpdate = () => {
    if (!newEmail || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    fetch(`http://localhost/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: newEmail,
        password: newPassword,
        confirmPassword: confirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error updating email/password:", data.error);
          setError(data.error);
          setSuccessMessage(""); // Clear success message on error
        } else {
          console.log("Email/password updated:", data.message);
          setUser((prevUser) => ({ ...prevUser, email: newEmail }));
          setNewPassword("");
          setConfirmPassword("");
          setEditMode(false);
          setError("");
          setSuccessMessage(data.message);
          // Update local storage with the new email
          localStorage.setItem("user_email", newEmail);
        }
      })
      .catch((error) => {
        console.error("Error updating email/password:", error);
        setError("An unexpected error occurred.");
        setSuccessMessage(""); // Clear success message on error
      });
  };

  const handleDeleteProfile = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    fetch(`http://localhost/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error deleting profile:", data.error);
        } else {
          setSuccessMessage(data.message);
          setError("");
          localStorage.clear();
          setTimeout(() => {
            useNavigate("/");
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error deleting profile:", error);
      });
  };

  return (
    <div>
      {user ? (
        <div className="profile">
          <h1>Welcome, {user.name}!</h1>
          <div className="row ">
            <div>
              <h3>Here are your profile details:</h3>
              <div className="email">
                <h4>Edit your email and password?</h4>
                <p>Current email: {user.email}</p>
                <div>
                  {editMode && (
                    <>
                      <label>New Email:</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="password">
                {editMode && (
                  <div>
                    <label>New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label>Confirm new Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
              )}
              <div className="buttons">
                {editMode ? (
                  <>
                    <button onClick={handleUpdate}>Confirm</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditMode(true)}>Edit</button>

                    <button onClick={() => { setConfirmDelete(!confirmDelete);}}>

                      {confirmDelete ? "Cancel" : "Delete Profile"}
                      
                    </button>
                    {confirmDelete && (
                      <button onClick={handleDeleteProfile}>
                        Confirm Deletion
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="artworks">
              <div className="artworks-container">
                <div className="artworks">
                  <h3>Your Artworks:</h3>
                  {artworks.length > 0 ? (
                    <ul>
                      {artworks.map((artwork) => (
                        <div className="artwork-card" key={artwork.id}>
                          <img src={artwork.image} alt={artwork.name} />
                          <p>Name: {artwork.name}</p>
                          <p>Description: {artwork.description}</p>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p>No artworks found for the specified user.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
