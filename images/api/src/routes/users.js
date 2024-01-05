// user route

const express = require("express");
const router = express.Router();
const User = require("../classes/User.js");
const bcrypt = require("bcryptjs");

/**
 * Error handling middleware.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {function} next - The next middleware function.
 */

const handleErrors = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error." });
};

router.use(handleErrors);

const validateInputs = (inputs, requireName = true) => {
  const { name, email, password } = inputs;
  if (requireName && (!name || !email || !password)) {
    throw new Error("Name, email, and password are required.");
  }

  if (!requireName && (!email || !password)) {
    throw new Error("Email and password are required.");
  }
};

/**
 * Retrieve all users from the database.
 *
 * @route GET /users
 * @returns {Object[]} An array of user objects.
 * @throws {Error} If there is an error in retrieving users.
 */
router.get("/", async (req, res, next) => {
  try {
    const users = await req.db
      .select("id", "name", "email", "password")
      .from("users");
    res.json(users);
  } catch (error) {
    handleErrors(error, req, res, next);
  }
});

/**
 * @route POST /users/register
 * @desc Register a new user.
 * @params {string} name - The name of the user.
 * @params {string} email - The email of the user.
 * @params {string} password - The password of the user.
 * @returns {Object} An object containing the new user's ID.
 * @throws {Error} If there is an error in registering a new user.
 */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    validateInputs({ name, email, password });

    if (password.length < 5 || !/\d/.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 5 characters long and contain at least one numeric digit.",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const [user] = await req
      .db("users")
      .insert({
        name: name,
        email: email,
        password: hashedPassword,
      })
      .returning("*");

    res.status(201).json({
      message: "User created successfully",
      userId: user,
    });
  } catch (error) {
    if (error.code === "23505" && error.constraint === "users_email_unique") {
      res.status(400).json({
        error: "Email is already in use. Please choose a different email.",
      });
    } else {
      handleErrors(error, req, res);
    }
  }
});

/**
 * @route POST /users/login
 * @desc Authenticate a user.
 * @params {string} email - The email of the user.
 * @params {string} password - The password of the user.
 * @returns {Object} An object containing user details upon successful authentication.
 * @throws {Error} If there is an error in the authentication process.
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    validateInputs({ email, password }, false);

    const user = await req.db("users").where("email", email).first();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    res.json({
      message: "Authentication successful.",
      user: user,
    });
  } catch (error) {
    handleErrors(error, req, res);
  }
});

/**
 * @route GET /users/:id
 * @desc Retrieve user details by user ID.
 * @params {string} id - The ID of the user.
 * @returns {Object} An object containing the user details.
 * @throws {Error} If there is an error in retrieving user details.
 */

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await req.db("users").where("id", userId).first();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { name, email } = user;

    const userWithDetails = new User({ id: userId, name, email });

    res.json({
      id: userWithDetails.id,
      name: userWithDetails.name,
      email: userWithDetails.email,
    });
  } catch (error) {
    handleErrors(error, req, res, next);
  }
});

/**
 * @route PUT /users/:id
 * @desc Update user details (email and/or password) by user ID.
 * @params {string} id - The ID of the user.
 * @body {string} email - The new email for the user (optional).
 * @body {string} password - The new password for the user (optional).
 * @body {string} confirmPassword - The confirmation of the new password.
 * @returns {Object} An object indicating the success of the update.
 * @throws {Error} If there is an error in updating user details.
 */

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, password, confirmPassword } = req.body;

    validateInputs({ email, password }, false);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await req.db("users").where("id", userId).first();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (email) {
      const emailExists = await req
        .db("users")
        .where("email", email)
        .andWhereNot("id", userId)
        .first();
      if (emailExists) {
        return res
          .status(400)
          .json({ error: "Email is already in use by another user." });
      }
      user.email = email;
    }

    if (password) {
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "Password and confirmation do not match." });
      }

      user.password = await bcrypt.hash(password.trim(), 10);
    }

    await req.db("users").where("id", userId).update({
      email: user.email,
      password: user.password,
    });

    res.json({ message: "User details updated successfully." });
  } catch (error) {
    handleErrors(error, req, res);
  }
});

/**
 * @route DELETE /users/:id
 * @desc Delete user by user ID.
 * @params {string} id - The ID of the user.
 * @returns {Object} An object indicating the success of the deletion.
 * @throws {Error} If there is an error in deleting the user.
 */

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const userExists = await req.db("users").where("id", userId).first();
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    await req.db("users").where("id", userId).del();

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    handleErrors(error, req, res);
  }
});

module.exports = router;
