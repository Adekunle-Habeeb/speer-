const express = require("express");
const Router = express.Router();
const { signupController, loginController } = require("../controllers/userController");


Router.post("/signup", signupController);
Router.post("/login", loginController);


module.exports = Router;