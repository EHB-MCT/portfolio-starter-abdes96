// user route

const express = require('express');
const router = express.Router();
const User = require('../classes/User.js');
const bcrypt = require('bcryptjs');

const handleErrors = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error.' });
};

const validateInputs = (inputs) => {
  const { name, email, password } = inputs;
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }
};

router.use(handleErrors); 

/**
 * @route GET /users
 * @desc Retrieve all user names from the database.
 * @returns {Array} An array of user names.
 * @throws {Error} If there is an error in retrieving user names.
 */

router.get('/', async (req, res) => {
  try {
    const users = await req.db.select('name').from('users');
    const usernames = users.map(user => user.name);
    res.json(usernames);
  } catch (error) {
    throw error; // Automatically handled by the error handling middleware
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    validateInputs({ name, email, password });

    const newUser = new User({ name, email, password });

    await newUser.hashPassword();

    const userId = await newUser.save();

    res.status(201).json({ userId });
  } catch (error) {
    throw error; 
  }
});

/**
 * @route GET /users/:id
 * @desc Retrieve user details by user ID.
 * @params {string} id - The ID of the user.
 * @returns {Object} An object containing the user details.
 * @throws {Error} If there is an error in retrieving user details.
 */

router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
      const user = await req.db('users').where('id', userId).first();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const { name, email } = user;

      const userWithDetails = new User({ id: userId, name, email });

      res.json({ id: userId, name, email });
    } catch (error) {
      throw error; 
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

router.put('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, password, confirmPassword } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
      const user = await req.db('users').where('id', userId).first();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (email) {
        const emailExists = await req.db('users').where('email', email).andWhereNot('id', userId).first();
        if (emailExists) {
          return res.status(400).json({ error: 'Email is already in use by another user.' });
        }
  
        user.email = email;
      }
  
      if (password) {
        if (password !== confirmPassword) {
          return res.status(400).json({ error: 'Password and confirmation do not match.' });
        }
  
        user.password = await bcrypt.hash(password, 10);
      }
  
      await req.db('users').where('id', userId).update({
        email: user.email,
        password: user.password,
      });
  
      res.json({ message: 'User details updated successfully.' });
    } catch (error) {
      throw error; 
    }
  });

/**
 * @route DELETE /users/:id
 * @desc Delete user by user ID.
 * @params {string} id - The ID of the user.
 * @returns {Object} An object indicating the success of the deletion.
 * @throws {Error} If there is an error in deleting the user.
 */

router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
      const userExists = await req.db('users').where('id', userId).first();
      if (!userExists) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      await req.db('users').where('id', userId).del();
  
      res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      throw error; 
    }
  });

module.exports = router;
