const express = require("express");
const fs = require('fs');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {User, validate} = require("../models/user");
const Joi = require("joi");
const checklogin = require("../middleware/authorize");
const multer  = require('multer');
const {S3Client, PutObjectCommand, GetObjectCommand} = require( '@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { userInfo } = require("os");

const storage = multer.memoryStorage();
const upload = multer({storage:storage})

// const upload = multer({ dest: 'uploads/' });


const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_BUCKET_REGION;
const accessKeyId = process.env.S3_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.S3_BUCKET_SECRET_KEY;

const s3 = new S3Client({
    region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  }
});

router.post("/register", async(req,res) => {
    try{
        const {error} = validate(req.body);
        if(error)
            return res.status(400).send({message:error.details[0].message});
        const user = await User.findOne({email:req.body.email});

        if(user)
            return res.status(409).send({message: "User with given email already exist!"});
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({...req.body, password:hashPassword}).save();
        res.status(201).send({message: "User created successfully"})
    }catch(error) {
        console.log(error)
        res.status(500).send({message: "Inernal server error"});
    }
});

router.post("/login", async(req,res) => {
    try{
        console.log("1")
        const {error} = validateLogin(req.body);

        if(error)
            return res.status(400).send({message: error.details[0].message});
        const user = await User.findOne({email:req.body.email});

        if(!user)
            return res.status(401).send({message: "Invalid Email or Password"});
        
        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );

        if(!validPassword)
            return res.status(401).send({message: "Invalid Email or Password"});
        // console.log(user)
        
        const token = await user.generateAuthToken();
        console.log(token)
        // user.save()
        // console.log(token)
        res.status(200).send({data:token, message: "Logged in successfully"});
    }catch(error) {
        res.status(500).send({message: "Internal server error"})
    }
});

const validateLogin = (data) => {
    const schema = Joi.object({
        email:Joi.string().email().required().label("Email"),
        password:Joi.string().required().label("Password")
    });

    return schema.validate(data)
}

router.get("/lists", async(req,res) => {
    User.find( async function (err, user) {
        if (err) {
            console.log(err);
        }else {
            
            let userLists = [];
            for(const singleUser of user) {
                // console.log(singleUser.image)
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: singleUser.image
                }
                console.log(getObjectParams)
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                // console.log(url)

                let tempObject = {
                    _id: singleUser._id,
                    user_name: singleUser.user_name,
                    bio: singleUser.bio,
                    image: url
                }

                userLists.push(tempObject)
                tempObject = {};
            }
            
            res.json(userLists);
        }
    });
});

router.get("/me",checklogin, async(req,res) => {
    User.findById(req.userId, async (error, data) => {
        if (error) {
            return next(error)
        } else {
            let tempObject = data;
            if(data.image) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: data.image
                }
                // console.log(getObjectParams)
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                // console.log(url)
                userLists = [];
                tempObject = {
                    _id: data._id,
                    user_name: data.user_name,
                    bio: data.bio,
                    image: url
                }
    
                // userLists.push(tempObject);
            }
            res.json(tempObject)
        }
    })
});

router.post("/update",upload.single('image'), checklogin, async(req,res) => {
    // console.log(req);
    const file = req.file

    // console.log(req.file)

    // console.log(req)
    const userInfo = {
        'user_name': req.body.user_name,
        'bio': req.body.bio,
    }

    if(file !== undefined) {
        userInfo['image'] = req.file.originalname

        const params = {
            Bucket: bucketName,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);
    }
    
    User.findByIdAndUpdate(req.userId, userInfo, { new: true }, async (err, user) => {
        if (err) {
            console.log("err", err);
            res.status(500).send(err);
        } else {
        console.log("success");
            // res.send(user);
            // console.log(user)

            let tempObject = user;
            const getObjectParams = {
                Bucket: bucketName,
                Key: user.image
            }
            // console.log(getObjectParams)
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            // console.log(url)
            userLists = [];
            tempObject = {
                _id: user._id,
                user_name: user.user_name,
                bio: user.bio,
                image: url
            }
            res.json(tempObject)
        }
    });
});

router.get("/verify", checklogin, async(req, res) => {
    // console.log(req)
    res.send(req.userId);
});

router.get("/owner", checklogin, async(req, res) =>{
    res.send(req.userId === req.headers.userid)
});

module.exports = router;