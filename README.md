# Artwork tracker

Artwork Tracker is a web application that allows users to explore and share artworks uploaded by the community. Users can view, upload, and share their favorite pieces with others.

## Purpose

This project is application written in JavaScript with an Express.js server and a Postgresql database.




## Getting Started

To get started with the project, follow these steps:

### Prerequisites

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.

### Clone the Repository

1. **Clone the repository using Git:**

    ```bash
    git clone https://github.com/EHB-MCT/portfolio-starter-abdes96.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd portfolio-starter-abdes96
    ```


### Configure Environment Variables

3. **Create a `.env` file in the project root with the following content:**

    ```env
    # Database Configuration
    POSTGRES_HOST= postgres
    POSTGRES_PASSWORD=
    POSTGRES_USER=
    POSTGRES_DB=
    PG_DATABASE=

    ```
   
    - Fill in the PostgreSQL variables (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) 


### Build and Start the Application

4. **Build and start the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

   The initial build may take around 20-40 seconds to complete. Once the build is finished, the entire project, including the Express.js server and PostgresSQL database, will be up and running.


Now, you can access the Artwork Tracker application by visiting the appropriate URL in your web browser.

Feel free to adjust the wording or provide additional context based on the specifics of your project.



# API Endpoints

## Artwork endpoints


### Create User

- **Endpoint:** `POST /users/register`
- **Description:** Register a new user.
- **Parameters:**
  - `name` (string): The name of the user.
  - `email` (string): The email of the user.
  - `password` (string): The password of the user.
- **Returns:** An object containing the new user's ID.
- **Throws:** If there is an error in registering a new user.

### Get All Users

- **Endpoint:** `GET /users`
- **Description:** Get all users.
- **Returns:** An array of user objects.
- **Throws:** If there is an error in retrieving users.

### Get User by ID

- **Endpoint:** `GET /users/:id`
- **Description:** Get a specific user by ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Returns:** An object containing the user details.
- **Throws:** If there is an error in retrieving user details.

### Update User by ID

- **Endpoint:** `PUT /users/:id`
- **Description:** Update user details (email and/or password) by user ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Body:**
  - `email` (string, optional): The new email for the user.
  - `password` (string, optional): The new password for the user.
  - `confirmPassword` (string): The confirmation of the new password.
- **Returns:** An object indicating the success of the update.
- **Throws:** If there is an error in updating user details.

### Delete User by ID

- **Endpoint:** `DELETE /users/:id`
- **Description:** Delete user by user ID.
- **Parameters:**
  - `id` (string): The ID of the user.
- **Returns:** An object indicating the success of the deletion.
- **Throws:** If there is an error in deleting the user.

### Authenticate User

- **Endpoint:** `POST /users/login`
- **Description:** Authenticate a user.
- **Body:**
  - `email` (string): The email of the user.
  - `password` (string): The password of the user.
- **Returns:** An object containing user details upon successful authentication.
- **Throws:** If there is an error in the authentication process.

## Artwork endpoints

### Create Artwork

- **Endpoint:** `POST /artworks`
- **Description:** Create a new artwork.


### Get All Artworks

- **Endpoint:** `GET /artworks`
- **Description:** Get all artworks.


### Get Artwork by ID

- **Endpoint:** `GET /artworks/:id`
- **Description:** Get a specific artwork by ID.


### Get Artworks by User ID

- **Endpoint:** `GET /artworks/user/:userId`
- **Description:** Get artworks of a specific user.


### Update Artwork by ID

- **Endpoint:** `PUT /artworks/:id`
- **Description:** Update a specific artwork by ID.



### Delete Artwork by ID

- **Endpoint:** `DELETE /artworks/:id`
- **Description:** Delete a specific artwork by ID.


