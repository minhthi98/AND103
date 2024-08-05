var express = require('express');
var router = express.Router();
var UserModel = require('../models/user'); // Ensure the correct import
var JWT = require('jsonwebtoken');
var config = require('../config');
const checkToken = require('./checkToken');

router.use(express.json());

// Create user
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone_number:
 *                 type: string
 *                 example: "123-456-7890"
 *               position:
 *                 type: string
 *                 example: "Developer"
 *               user_role:
 *                 type: string
 *                 example: "admin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               join_date:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               team:
 *                 type: string
 *                 example: "Development"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 position:
 *                   type: string
 *                 user_role:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 address:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 join_date:
 *                   type: string
 *                   format: date
 *                 team:
 *                   type: string
 *       400:
 *         description: Name, email, and password are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name, email, and password are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post('/register',checkToken, async function(req, res, next) {
  try {
    
    const { name, phone_number, position, user_role, email, address, gender, dob, join_date, team, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = new UserModel({
      name,
      phone_number,
      position,
      user_role,
      email,
      address,
      gender,
      dob,
      join_date,
      team,
      password,
      activated: true,
      created_by: req.Id
    });

    const result = await user.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// User login
/**
 * @swagger
 * users/login:
 *   post:
 *     summary: Login user and receive a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns user details and tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     # Include other user properties as needed
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post('/login', async function(req, res, next) { // Changed from GET to POST
  try {
    const { email, password } = req.body;
    const checkUser = await UserModel.findOne({ email, password });
    if (checkUser) {
      const token = JWT.sign({  id: checkUser._id }, config.SECRETKEY, { expiresIn: '2h' });
      const refreshToken = JWT.sign({id: checkUser._id }, config.SECRETKEY, { expiresIn: '1d' });
      res.status(200).json({ result: true, message: checkUser, token: token, refreshToken: refreshToken });
    } else {
      res.status(404).json({ result: false, message: 'User Not Found' });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ result: false, message: err.message });
  }
});

// get by id
/**
 * @swagger
 * /users/getById:
 *   get:
 *     summary: Retrieve a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "603d2f4d5b3f8a1b4c3d8b15"
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phone_number:
 *                   type: string
 *                 position:
 *                   type: string
 *                 user_role:
 *                   type: string
 *                 address:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 join_date:
 *                   type: string
 *                   format: date
 *                 team:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get('/getById',checkToken, async function(req, res, next) {
  try {
    const { id } = req.query;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

// update by id
/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update user information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "603d2f4d5b3f8a1b4c3d8b15"
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone_number:
 *                 type: string
 *                 example: "123-456-7890"
 *               position:
 *                 type: string
 *                 example: "Developer"
 *               user_role:
 *                 type: string
 *                 example: "admin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               join_date:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               team:
 *                 type: string
 *                 example: "Development"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 position:
 *                   type: string
 *                 user_role:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 address:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 join_date:
 *                   type: string
 *                   format: date
 *                 team:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Not Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.put('/update',checkToken, async function(req, res, next) {
  try {
    const { id } = req.query;
    const { name, phone_number, position, user_role, email, address, gender, dob, join_date, team } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    user.name = name;
    user.phone_number = phone_number;
    user.position = position;
    user.user_role = user_role;
    user.email = email;
    user.address = address;
    user.gender = gender;
    user.dob = dob;
    user.join_date = join_date;
    user.team = team;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
