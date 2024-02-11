require("dotenv").config();

const User = require("../models/user/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { ErrorResponse, SuccessResponse } = require("../helpers/responseService");
const ReportUser = require('../models/user/reportUser')
const Vendor = require("../models/vendor/vendorModel");
const customerSupport = require("../models/user/customerSupport");
const sendRegistrationEmail = require("../config/emailConfigs/emailConfig");

const sendForgotPinCodeEmail = require("../config/emailConfigs/forgetEmail");
const Funeral = require("../models/user/funeralModel");
const Community = require("../models/user/communityModel");
const sharp = require('sharp')
const Donation = require('../models/user/donationModel')

const axios = require("axios")





const registerUser = async (req, res) => {
  console.log("inside userCotnroler")
  console.log({body : req.body})
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
  try {
    const { fullname, email, password, phone } = req.body;


    if (req.body.email == undefined || req.body.email == '') {
      return ErrorResponse(res, 'Email  is Required !');

    }
    if (req.body.password == undefined || req.body.password == '') {
      return ErrorResponse(res, 'Password  is Required !');

    }

    const userExists = await User.findOne({ email: req.body.email.toLowerCase().replace(/\s/g, '') })
    console.log({userExists})

    if (userExists) {
      return ErrorResponse(res, 'This Email Is Already Registered Please Login Instead ')
    }

    if (!passwordRegex.test(req.body.password)) {
      return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
    }


    //   const passHash = await bcrypt.hash(password, 10)
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    const reqBody = new User({
      fullname,
      email : email.toLowerCase(),
      phone,
      profilePic: "/assets/user_profile.png",
      salt,
      password: hash,
    })
    let user = await reqBody.save()
    const token = await genJwtToken(user._id)
    console.log({ token })
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    delete userWithoutPassword.salt;

    return SuccessResponse(res, { token, user: userWithoutPassword })
  } catch (error) {
    console.error("Error during user registration:", error);
    ErrorResponse(res, error.message)
  }
}





const downloadAndProcessImage = async (url, destination) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    await sharp(response.data)
      .toFile(destination);

  } catch (error) {
    console.error('Failed:', error);
  }
};


const continue_with_google = async (req, res) => {
  try {
    const { email, fullname, photoURL, phoneNumber } = req.body
    console.log({ gogoleBody: req.body })
    const userExists = await User.findOne({ email })

    console.log({userExists})
    let fileName;
    const emailName = email.toString().split("@")[0]
    if (photoURL) {
      fileName = `/uploads/${emailName}_${Date.now()}.webp`
      downloadAndProcessImage(photoURL, `./public${fileName}`)
    }

    if (!userExists) {
      const newUser = User({
        fullname,
        email,
        profilePic: fileName,
        phone: phoneNumber
      })
      const saveUser = await newUser.save()
      const token = await genJwtToken(saveUser._id)
      console.log({ token })
      const userWithoutPassword = saveUser.toObject();
      delete userWithoutPassword.password;
      delete userWithoutPassword.salt;
      await sendRegistrationEmail(email, fullname);
      return SuccessResponse(res, { token, user: userWithoutPassword })
    } else {
      const token = await genJwtToken(userExists._id)
      const userWithoutPassword = userExists.toObject();
      delete userWithoutPassword.salt
      delete userWithoutPassword.password
      return SuccessResponse(res, { token, user: userWithoutPassword })

    }

  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};


const loginUser = async function (req, res) {

  console.log(req.body)
  const { email, password } = req.body
  try {
    if (!email) {
      return ErrorResponse(res, 'Email is Required!');

    }
    let userExists = await User.findOne({ email });
    if (userExists == null || userExists.length < 1) {
      return ErrorResponse(res, 'User Not Matched !');
    }
    if (userExists.accountStatus === 'freezed') {
      return ErrorResponse(res, 'Your Account is temporarily blocked!');
    }
    if (userExists.accountStatus === 'suspended') {
      return ErrorResponse(res, 'Your Account is suspended!');
    }

    if (!userExists.password || userExists.password == "") {
      return ErrorResponse(res, 'Please login via Google');
    }


    const match = await bcrypt.compare(password, userExists.password);
    if (!match) {
      return ErrorResponse(res, 'Invalid Password!');
    }

    const token = await genJwtToken(userExists._id)
    const userWithoutPassword = userExists.toObject();
    delete userWithoutPassword.salt
    delete userWithoutPassword.password

    return SuccessResponse(res, { token, user: userWithoutPassword })
  } catch (error) {
    console.error(error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
}



const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(["-password", "-salt", "-forgetPasswordOTP", "-resetPasswordExpires", "-resetPasswordToken", "-resetPasswordGeneratedAt"])

    if (!user) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    return SuccessResponse(res, user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
};


getUserFromToken = async (req, res) => {

  try {

    if (!req.user) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    const userDetails = await User.findById(req.user.id).select(["-password", "-salt", "-forgetPasswordOTP", "-resetPasswordExpires", "-resetPasswordToken", "-resetPasswordGeneratedAt"])
    if (!userDetails) {
      return ErrorResponse(res, 'User Not Matched !');
    }


    return SuccessResponse(res, userDetails);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
};





const updateUser = async (req, res) => {
  const { fullname, phone } = req.body;
  try {


    const user = await User.findById(req.user.id);

    if (!user) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    // Update user details

    user.phone = phone || user.phone;
    user.fullname = fullname || user.fullname;
    user.profilePic = req.file && req.file.filename ? "/uploads/" + req.file.filename : user.profilePic


    const updatedUser = await user.save();

    SuccessResponse(res, "User updated Successfully .")
  } catch (error) {
    console.error('Error updating user:', error);
    return ErrorResponse(res, error.message);
  }
};




// Delete user
const createComunity = async (req, res) => {
  console.log(req.user)
  console.log(req.body)
  try {
    const { title, description  , type} = req.body;
    const community =  Community({
      title,
      userReff : req.user.id,
      description,
      type,
      thumbnail : req.file && `/uploads/${req.file.filename}`
    })

    community.members.push(req.user.id)
    await community.save()
    SuccessResponse(res, community)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};



const createDonation = async (req, res) => {
  console.log(req.user)
  console.log(req.body)
  try {
    const { title, description   , target , achieved} = req.body;
    const donation = await Donation({
      title,
      description,
      target,
      userReff : req.user.id,
      achieved,
      picture : req.files[0] &&`/uploads/${req.files[0].filename}`,
    }).save()

    
    
    SuccessResponse(res, donation)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};

const getAllDonations = async (req, res) => {

  try {
    const donations = await Donation.find()
    SuccessResponse(res, donations)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};


// Delete user
const getAllCommunities = async (req, res) => {
 
  try {
    const communities = await Community.find({ members  : {$in : [req.user.id]}}).sort({createdAt : -1});

    SuccessResponse(res, communities)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};



// Delete user
const deleteUser = async (req, res) => {
  console.log(req.user)
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return ErrorResponse(res, 'User Not Matched !');
    }
    SuccessResponse(res, user)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};







const verifyForgetPasswordUser = async function (req, res) {
  console.log("authoried")
  try {
    if (req.params.email == undefined || req.params.email == '') {
      return ErrorResponse(res, "Email Is Required  !")

    }
    let user = await User.findOne({ email: req.params.email })
    if(!user){
        return ErrorResponse(res, "No User exits !")
    }
    console.log({ user })
    let OTPCODE = Math.floor(1000 + Math.random() * 9000);
    const emailSent = await sendForgotPinCodeEmail(user.email, user.firstName, OTPCODE)
    console.log({ emailSent })

    user.forgetPasswordOTP = OTPCODE
    const otp_generatedAt = new Date(Date.now())
    user.resetPasswordGeneratedAt = otp_generatedAt
    const otp_expiresAt = new Date(Date.now() + 90000)
    user.resetPasswordExpires = otp_expiresAt
    await user.save()
    if (user == null || user.length < 1) {
      return ErrorResponse(res, "User Not Matched !")
    } else {
      return SuccessResponse(res, { id: user._id, otp_generatedAt, otp_expiresAt , OTPCODE })
    }
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, "Internal server erorr !")
  }
}



const forgetPasswordUserOtpValidation = async (req, res) => {
  const { id, OTPCODE } = req.body
  console.log(req.body)
  try {

    if (id == undefined || id == '') {
      return ErrorResponse(res, "ID Field Is Required  !")

    }
    if (OTPCODE == undefined || OTPCODE == "") {
      return ErrorResponse(res, "OTPCODE Is Required  !")

    }

    const checkUser = await User.findById(id)
    if (checkUser == undefined || checkUser == null) {
      return ErrorResponse(res, "User Not Matched  !")

    }

    if (checkUser.resetPasswordExpires < Date.now()) {
      return ErrorResponse(res, "OTP has been Expired , Please Required new one   !")

    }
    if (checkUser.forgetPasswordOTP !== OTPCODE) {
      return ErrorResponse(res, "Invalid OTP Code  !")
    }
    const resetPasswordToken = await genJwtForgetPasswordToken(checkUser._id)
    checkUser.resetPasswordToken = resetPasswordToken
    await checkUser.save()

    return SuccessResponse(res, { resetPasswordToken })

  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}





const request_changeForgetPassword = async (req, res) => {
  console.log(req.body)
  try {
    const { reset_password_token, newPassword } = req.body

    if (reset_password_token == undefined || reset_password_token == '') {
      return ErrorResponse(res, "Reset Password Token  Is Required  !")

    }
    if (newPassword == undefined || newPassword == "") {
      return ErrorResponse(res, "Password  Is Required  !")

    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
    }

    const userExists = jwt.verify(reset_password_token, process.env.JWT_SECRET_KEY)
    const user = await User.findOne({ _id: userExists.id, resetPasswordToken: reset_password_token })

    if (user == undefined || user == null) {
      return ErrorResponse(res, "User Not Matched  !")

    }


    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(newPassword, salt);
    user.salt = salt
    user.password = hash
    user.forgetPasswordOTP = ""
    user.resetPasswordGeneratedAt = ""
    user.resetPasswordToken = ""
    user.resetPasswordExpires = ""

    await user.save()

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.salt
    delete userWithoutPassword.password

    const token = await genJwtToken(user._id)
    return SuccessResponse(res, { token, user: userWithoutPassword })

  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}



const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return ErrorResponse(res, "User Not Matched !")
    }

    if(!user.password){
        return ErrorResponse(res, "your account is created via Social Login , please reset your password first!")
    }
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return ErrorResponse(res, 'Old Password is not correct')
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
      }



      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(newPassword, salt);
      user.salt = salt;
      user.password = hash;
      const updatedUser = await user.save();
      return SuccessResponse(res, "Password Changed Succesfully");
    }

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}

const  get_services_wishlist = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('services_wishlist').populate("services_wishlist")
    const user = await User.findById(req.user.id).select('wishlist').populate("wishlist")
    console.log({ user })
    if (!user) {
      return ErrorResponse(res, "User Not Matched !")
    }


    return SuccessResponse(res, user.wishlist || [])
  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}
const check_service_in_wishlist = async (req, res) => {
  const { business_id } = req.params
  try {
    const user = await User.findById(req.user.id).select('wishlist')
    if (!user) {
      return ErrorResponse(res, "User Not Matched !")
    }

    if (user.wishlist.includes(business_id)) {
      return SuccessResponse(res,  true)
    } else {
      return SuccessResponse(res,  false )
    }

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}



const toggle_wishlist = async (req, res) => {
  const { business_id, type } = req.params
  try {
    const user = await User.findById(req.user.id).select('wishlist')

    if (!user) {
      return ErrorResponse(res, "User Not Matched !")
    }

    if (type === "ADD") {
      if (user.wishlist.includes(business_id)) {
        return ErrorResponse(res, "Service Already in Wishlist")
      }
      user.wishlist.push(business_id)
      await user.save()
      return SuccessResponse(res, "Service Added to Wishlist ")
    } else if (type === "REMOVE") {
      if (!user.wishlist.includes(business_id)) {
        return ErrorResponse(res, "Service Doest not exits  in Wishlist")
      }
      user.wishlist = user.wishlist.filter((item) => item.toString() !== business_id.toString())
      await user.save()
      return SuccessResponse(res, "Service Removed from Wishlist ")
    }
    return ErrorResponse(res, "Something went Wrong :(")

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}

const requestCustomerSupport = async (req, res) => {
  const { name, email, type, issue } = req.body
  try {
    const filesArray = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        filesArray.push("/uploads/" + file.filename)
      })
    }

    if (!name || name == "") {
      return ErrorResponse(res, "Name is Required !")
    }
    if (!email || email == "") {
      return ErrorResponse(res, "email is Required !")
    }
    if (!issue || issue == "") {
      return ErrorResponse(res, "Issue can't be sent empty  !")
    }

    const data = customerSupport({
      name,
      email,
      type,
      issue,
      userReff: req.user.id,
      files: filesArray
    })

    const newSupportReq = await data.save()
    return SuccessResponse(res, newSupportReq)
  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}




// ############################################# report users scripts 






const report_user = async (req, res) => {
  const { user_id } = req.params
  const { reportOption, text } = req.body
  try {
    const user = await User.findById(req.user.id).select("_id")
    if (!user) {
      return ErrorResponse(res, "User Not Matched !")
    }

    if (user_id.toString() === req.user.id.toString()) {
      return ErrorResponse(res, "You can't Report Yourself!")
    }

    const reportExists = await ReportUser.findOne({ $and: [{ reportedBy: req.user.id }, { reportedUser: user_id }] })
    if (reportExists) {
      return ErrorResponse(res, "You Already had reported this user !")
    }
    let newReport = new ReportUser({
      reportedBy: req.user.id,
      reportedUser: user_id,
      reportOption,
      text
    })
    const new_report = await newReport.save()
    return SuccessResponse(res, new_report)

  } catch (error) {
    console.log(error)
    ErrorResponse(res, error.message)
  }
}






















const genJwtToken = async function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" })
  return token;
}
const genJwtForgetPasswordToken = async function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: 90000 })
  return token;
}






function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - dob.getFullYear();
  if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}


module.exports = {
  registerUser,
  loginUser,
  toggle_wishlist,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  verifyForgetPasswordUser,
  request_changeForgetPassword,
  get_services_wishlist,
  requestCustomerSupport,
  check_service_in_wishlist,
  createComunity,
  getAllCommunities,
  createDonation,
  getAllDonations,
  report_user,
  forgetPasswordUserOtpValidation,
  continue_with_google,
};
