const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");



const signupController = expressAsyncHandler(async (req, res) => {
    try {
      const { firstName, lastName, email, password, username } = req.body;
  
      // Check for all required fields
      if (!firstName || !lastName || !email || !password || !username) {
        return res.status(400).json({ msg: "All fields are required" });
      }
  
      // Check if an account with the same email already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ msg: "Account already exists" });
      }
  
      // Create a new user
      const user = new User({
        firstName,
        lastName,
        username,
        email,
        password,
      });
   
      // Save the user
      await user.save();

      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ msg: "Registration failed" });
    }
});
  
  

const loginController = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) { 
        req.user = {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
        };

        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });

    } else {
        res.status(400).json({ msg: "Invalid Username or Password" });
    }
});


module.exports = {
    signupController,
    loginController,
}