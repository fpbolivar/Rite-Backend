require("dotenv").config();

var jwt = require('jsonwebtoken');
const Vendor = require("../models/vendor/vendorModel")
const User = require('../models/user/userModel');

module.exports.isAuthenticated = (req, res, next) => {
  try {
    var authorization = req.header('Authorization');

    console.log({authorization})
    if (
      authorization == null ||
      authorization === '' ||
      !authorization ||
      authorization == undefined
    ) {
      return res.send({
        Success: false,
        body: null,
        error: 'authentication token is required',
      });
    }
    var token = authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, getuser) => {
      console.log({err})
      console.log({getuser})
      if (err) {
        return res.send({
          Success: false,
          body: null,
          error: 'Failed to authenticate token.',
        });
      }
      const userExists = await User.findById(getuser.id).select("_id")
      if (!userExists) {
        return res.send({
          Success: false,
          body: null,
          error: 'No User Exists !',
        });
      }
      req.user = getuser;
      next();
    });
  } catch (error) {
    return res.send({ Success: false, body: null, error: error.message });
  }
};



module.exports.isVendorAuthenticated = (req, res, next) => {
  try {
    var authorization = req.header('Authorization');

    console.log({authorization})
    if (
      authorization == null ||
      authorization === '' ||
      !authorization ||
      authorization == undefined
    ) {
      return res.send({
        Success: false,
        body: null,
        error: 'authentication token is required',
      });
    }
    var token = authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, getuser) => {
      console.log({err})
      console.log({getuser})
      if (err) {
        return res.send({
          Success: false,
          body: null,
          error: 'Failed to authenticate token.',
        });
      }
      const userExists = await Vendor.findById(getuser.id).select("_id")
      if (!userExists) {
        return res.send({
          Success: false,
          body: null,
          error: 'No Vendor Exists !',
        });
      }
      req.user = getuser;
      next();
    });
  } catch (error) {
    return res.send({ Success: false, body: null, error: error.message });
  }
};






module.exports.verifyRole = function checkUserRole(expectedRole) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      console.log({userId})
      const user = await User.findById(userId).populate('role');

      if (!user) {
        return res.status(401).json({ Success : false,  error: 'User not authenticated.' });
      }

      if (user.role?.title === expectedRole) {
        return next();
      }

      return res.status(403).json({ Success : false ,  error: 'Forbidden: Insufficient permissions.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ Success : false  ,  error: 'Internal Server Error' });
    }
  };
}