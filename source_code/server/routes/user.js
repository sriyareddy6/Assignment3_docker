const router = require("express").Router();
const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const checklogin = require("../middleware/authorize");

router.get('/', checklogin, (req, res) => {
    console.log(req.userId);
});