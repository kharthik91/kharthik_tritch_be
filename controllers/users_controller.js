const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { UserModel } = require("../models/users_model");
const {
  schemaValidator,
  loginValidator,
  updateSchemaValidator,
  changePasswordValidator,
} = require("../validations/users_validations");

module.exports = {
  register: async (req, res) => {
    // validate user form input
    const validationResult = schemaValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }

    const validatedParams = validationResult.value;

    // ensure pw and confirmPw is the same
    if (validatedParams.password !== validatedParams.confirmPassword) {
      res.statusCode = 400;
      return res.json(`Fat fingers alert!!`);
    }

    // ensure that user does not already exist
    let user = null;

    try {
      user = await UserModel.findOne({
        email: validatedParams.email,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (user) {
      res.statusCode = 409;
      return res.json();
    }

    // convert password to a hash value
    let hash = "";

    try {
      hash = await bcrypt.hash(validatedParams.password, 10);
    } catch (err) {
      res.statusCode = 500;
      return res.json();
    }

    if (hash === "") {
      res.statusCode = 500;
      return res.json();
    }

    // create user
    try {
      user = await UserModel.create({
        firstName: validatedParams.firstName,
        lastName: validatedParams.lastName,
        email: validatedParams.email,
        hash: hash,
      });

      res.statusCode = 201;
      return res.json(user._id);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }
  },

  login: async (req, res) => {
    // validate user input
    const validationResult = loginValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }

    const validatedParams = validationResult.value;

    // ensure that user exists
    let user = null;
    try {
      user = await UserModel.findOne({ email: validatedParams.email });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!user) {
      res.statusCode = 400;
      return res.json({
        success: false,
        message: `Email or password is incorrect!`,
      });
    }

    // ensure user input pw matches saved pw
    let passwordValidated = false;

    try {
      passwordValidated = await bcrypt.compare(
        validatedParams.password,
        user.hash
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!passwordValidated) {
      res.statusCode = 400;
      res.json({
        success: false,
        message: `Email or password is incorrect!`,
      });
    }

    // create accessToken & refreshToken for added security
    const accessToken = jwt.sign(user.email, process.env.JWT_SECRET);

    const refreshToken = jwt.sign(user.email, process.env.REFRESH_TOKEN_SECRET);

    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  },

  updateParticulars: async (req, res) => {
    // validate user input - limited to firstname, lastname, email
    const validationResult = updateSchemaValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }

    let validatedParams = validationResult.value;

    // check if auth_token is present in headers sent from FE
    if (!req.headers.auth_token) {
      res.statusCode = 403;
      return res.json({
        message: `Unable to authenticate user's access`,
      });
    }

    // verify that the auth_token is valid
    let verifiedToken = null;

    try {
      verifiedToken = await jwt.verify(
        req.headers.auth_token,
        process.env.JWT_SECRET
      );
    } catch (err) {
      console.log(err);
      res.statusCode = 403;
      res.json({
        message: `Unable to authenticate user's access`,
      });
    }

    if (verifiedToken === null) {
      res.statusCode = 403;
      return res.json({
        message: `Unable to authenticate user's access`,
      });
    }

    // get current user data
    let currentUser = null;

    try {
      currentUser = await UserModel.findOne({ _id: req.params.userID });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!currentUser) {
      res.statusCode = 400;
      return res.json();
    }

    let updatedUser = null;

    let updateParams = {
      firstName: validatedParams.firstName,
      lastName: validatedParams.lastName,
    };

    if (validatedParams.email !== currentUser.email) {
      updateParams.email = validatedParams.email;
    }

    try {
      updatedUser = await UserModel.findOneAndUpdate(
        {
          _id: req.params.userID,
        },
        updateParams,
        { new: true }
      );

      if (!updatedUser) {
        res.statusCode = 500;
        return res.json(`error updating user's particulars`);
      }

      // use the updated particulars to sign a new jwt token
      let updatedAccessToken = jwt.sign(
        updatedUser.email,
        process.env.JWT_SECRET
      );

      let updatedRefreshToken = jwt.sign(
        updatedUser.email,
        process.env.REFRESH_TOKEN_SECRET
      );

      res.statusCode = 200;
      res.json({
        accessToken: updatedAccessToken,
        refreshToken: updatedRefreshToken,
      });
    } catch (err) {
      res.statusCode = 500;
      console.log(err);
      return res.json();
    }
  },

  changePassword: async (req, res) => {
    // validate that user exists
    console.log(req.params);
    let user = null;

    try {
      user = await UserModel.findOne({ _id: req.params.userID });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!user) {
      res.statusCode = 400;
      return res.json();
    }

    console.log(user);

    // validate that user has auth
    if (!req.headers.auth_token) {
      res.statusCode = 403;
      return res.json(`Not authorised!!!`);
    }

    // validate user input to change pw
    const validationResult = changePasswordValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.json(validationResult.error);
    }

    const validatedPasswords = validationResult.value;

    // check that both passwords are the same
    if (validatedPasswords.password !== validatedPasswords.confirmPassword) {
      res.statusCode = 400;
      return res.json({
        success: "false",
        message: "Passwords do not match",
      });
    }

    // encrypt password to hash
    let newHash = "";

    try {
      newHash = await bcrypt.hash(validatedPasswords.password, 10);
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    // save new hash in db
    let changePasswordResponse = null;

    try {
      changePasswordResponse = await UserModel.findOneAndUpdate(
        {
          _id: req.params.userID,
        },
        {
          hash: newHash,
        },
        { new: true }
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    let newToken,
      newRefreshToken = null;

    console.log(user.email);

    try {
      newToken = await jwt.sign(user.email, process.env.JWT_SECRET);

      newRefreshToken = await jwt.sign(
        user.email,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(`kekl`);
    }

    if (!newToken || !newRefreshToken) {
      res.statusCode = 500;
      return res.json(`Error`);
    }

    return res.json({
      accessToken: newToken,
      refreshToken: newRefreshToken,
    });
  },

  logout: (req, res) => {
    //  clear token from client side
    res.clearCookie("auth_token");
    return res.json(`Logout successful`);
  },
};
