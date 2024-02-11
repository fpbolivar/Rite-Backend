const { ErrorResponse, SuccessResponse } = require("../helpers/responseService");
const Vendor = require('../models/vendor/vendorModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const sendForgotPinCodeEmail = require("../config/emailConfigs/forgetEmail");

const get_all_vendors = async (req, res) => {
    try {
       SuccessResponse(res , "get all")
    } catch (error) {
        console.log(error)
        ErrorResponse(res, error.message)
    }

}

const register_vendor = async (req, res) => {
    console.log(req.body)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
  try {
    const { fullname , email, password, phone , city , category , subCategory , username } = req.body;


    if (req.body.email == undefined || req.body.email == '') {
      return ErrorResponse(res, 'Email  is Required !');

    }
    if (req.body.category == undefined || req.body.category == '') {
      return ErrorResponse(res, 'category  is Required !');
    }


    if (req.body.password == undefined || req.body.password == '') {
      return ErrorResponse(res, 'Password  is Required !');

    }

    const vendorExists = await Vendor.findOne({ email: req.body.email.toLowerCase().replace(/\s/g, '') })
  
    if(vendorExists){
      return ErrorResponse(res,'This Email Is Already Registered Please Login Instead ')
    }

    if (!passwordRegex.test(req.body.password)) {
      return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
    }


    //   const passHash = await bcrypt.hash(password, 10)
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    const reqBody = new Vendor({
      fullname,
      email,
      phone,
      address : {
        city,
      },
      username,
      category,
      agreed_to_policies : true,
      subCategory,
      profilePic : "/assets/user_profile.png",
      password: hash,
    })
    let vendor = await reqBody.save()
    const token = await genJwtToken(vendor._id)
    console.log({ token })
    const vendorWithoutPassword = vendor.toObject();
    delete vendorWithoutPassword.password;
    delete vendorWithoutPassword.salt;

    return SuccessResponse(res, { token, vendor : vendorWithoutPassword })
  } catch (error) {
    console.error("Error during user registration:", error);
    ErrorResponse(res, error.message)
  }

}




loginVendor = async function (req, res) {

  const { email, password } = req.body
try {
  
  
  if (!email) {
    return ErrorResponse(res, 'Email is Required!');

  }
  let vendorExists = await Vendor.findOne({ email });
  if (!vendorExists) {
    return ErrorResponse(res, 'Vendor Not Matched !');
  }
 

  const match = await bcrypt.compare(password, vendorExists.password);
  if (!match) {
    return ErrorResponse(res, 'Invalid Password!');
  }

  const token = await genJwtToken(vendorExists._id)
  const vendorWithoutPassword = vendorExists.toObject();
  delete vendorWithoutPassword.salt
  delete vendorWithoutPassword.password

  return SuccessResponse(res, { token, vendor : vendorWithoutPassword })
} catch (error) {
  console.error( error);
  return ErrorResponse(res, 'Internal Server Error !' + error.message);
}
}



const getVendorById = async (req, res) => {
  const { id } = req.params;

  try {
    const vendor = await Vendor.findById(id).select(["-password", "-salt" , "-forgetPasswordOTP" , "-resetPasswordExpires" , "-resetPasswordToken" , "-resetPasswordGeneratedAt"])

    if (!vendor) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    return SuccessResponse(res, vendor);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
};


const getVendorByToken = async (req, res) => {

  try {

    if (!req.user) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    const vendorDetails = await Vendor.findById(req.user.id).select(["-password", "-salt" , "-forgetPasswordOTP" , "-resetPasswordExpires" , "-resetPasswordToken" , "-resetPasswordGeneratedAt"])
    if (!vendorDetails) {
      return ErrorResponse(res, 'User Not Matched !');
    }


    return SuccessResponse(res, vendorDetails);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return ErrorResponse(res, 'Internal Server Error !' + error.message);
  }
};





const updateVendor = async (req, res) => {
  const { fullname, phone  , username , city  } = req.body;
  console.log(req.body)
  try {


    const user = await Vendor.findById(req.user.id);

    if (!user) {
      return ErrorResponse(res, 'User Not Matched !');
    }

    // Update user details

    user.phone = phone || user.phone;
    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.city = city || user.city;
    user.profilePic = req.file && req.file.filename ? "/uploads/" + req.file.filename : user.profilePic


    const updatedUser = await user.save();

    SuccessResponse(res, "User updated Successfully .")
  } catch (error) {
    console.error('Error updating user:', error);
    return ErrorResponse(res, error.message);
  }
};





// Delete user
const deleteVendorProfile = async (req, res) => {
  console.log(req.user)
  try {
    const vendor = await Vendor.findByIdAndDelete(req.user.id);
    if (!vendor) {
      return ErrorResponse(res, 'vendor Not Matched !');
    }
    SuccessResponse(res, "Profile Deleted")
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};







 const verifyForgetPasswordVendor = async function (req, res) {
  console.log("authoried")
  try {
    if (req.params.email == undefined || req.params.email == '') {
      return ErrorResponse(res, "Email Is Required  !")

    }
    let vendor = await Vendor.findOne({ email: req.params.email })
    if(!vendor){
        return ErrorResponse(res,  "Email Is Not Registered With Us !")
    }
    let OTPCODE = Math.floor(1000 + Math.random() * 9000);
    const emailSent = await sendForgotPinCodeEmail(vendor.email, vendor.firstName, OTPCODE)
    console.log({emailSent})

    vendor.forgetPasswordOTP = OTPCODE
    const otp_generatedAt = new Date(Date.now())
    vendor.resetPasswordGeneratedAt = otp_generatedAt
    const otp_expiresAt = new Date(Date.now() + 90000)
    vendor.resetPasswordExpires = otp_expiresAt
    await vendor.save()
    if (vendor == null) {
      return ErrorResponse(res, "User Not Matched !")
    } else {
      return SuccessResponse(res, { id: vendor._id, otp_generatedAt, otp_expiresAt , OTPCODE })
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

    const checkUser = await Vendor.findById(id)
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
    const user = await Vendor.findOne({ _id: userExists.id, resetPasswordToken: reset_password_token })

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
    return SuccessResponse(res, {token, user : userWithoutPassword})

  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}



changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  try {
    const vendor = await Vendor.findById(req.user.id)
    if (!vendor) {
      return ErrorResponse(res, "User Not Matched !")
    }

    const match = await bcrypt.compare(oldPassword, vendor.password);

    if (!match) {
      return ErrorResponse(res, 'Old Password is not correct')
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return ErrorResponse(res, 'Password Should must contain : A Capital letter, A Number  and A special Character');
      }
  


      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(newPassword, salt);
      vendor.salt = salt;
      vendor.password = hash;
      const updatedUser = await vendor.save();
      return SuccessResponse(res, "Password Changed Succesfully");
    }

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
  
  



module.exports = {
    register_vendor,
    get_all_vendors,
    changePassword,
    getVendorById,
    loginVendor,
    request_changeForgetPassword,
    getVendorByToken,
    updateVendor,
    forgetPasswordUserOtpValidation,
    verifyForgetPasswordVendor,
    deleteVendorProfile,

} 