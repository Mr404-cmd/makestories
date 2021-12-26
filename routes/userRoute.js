import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user";
import hashPassword from "../middleware/hashPassword";
import checkAuth from "../middleware/checkAuth";
import multer from "multer"

const router = new express.Router();
// const upload = multer({
//   dest: 'images'
//   })
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
const UserRoute = () => {
  router.post("/register",upload.single('avtar'), async (req, res) => {
    try {
      console.log(req.file)
      const { name, email, password, phone, dob } = req.body;
      const user = await userModel.find({ email: req.body.email });
      if (user.length >= 1) {
        res.send({
          code: 409,
          msg: "Email Already Registerd",
        });
      } else {
        const hashpassword = await hashPassword(req.body.password);
        const svaeRegisteration = new userModel({
          name: name,
          email: email,
          password: hashpassword,
          phone: phone,
          dob: dob,
          avtar: req.file.path,
        });
        const saved = await svaeRegisteration.save();
        res.send({
          code: 200,
          msg: "Register successfully",
        });
      }
    } catch (e) {
      console.log(e);
      res.send({
        code: 500,
        msg: "Registration Failed !!!",
      });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const loginUser = await userModel.find({ email: req.body.email });
      if (loginUser < 1) {
        res.send({
          code: 404,
          msg: "Auth Failed",
        });
      }
      const cmp = bcrypt.compare(req.body.password, loginUser[0].password);
      if (cmp) {
        const token = jwt.sign(
          {
            email: loginUser[0].email,
            userId: loginUser[0]._id,
          },
          "secret",
          {
            expiresIn: "12h",
          }
        );
        res.send({
          code: 200,
          message: "Auth successful",
          token: token,
        });
      }
    } catch (error) {
      res.send({
        code: 500,
        message: "Auth Failed",
      });
    }
  });
  
  return router;
};
export default UserRoute;
