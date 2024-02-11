
const vendorRouter = require("express").Router()
const { upload } = require('../utils/multer')

const {
    register_vendor,
    get_all_vendors,
    getVendorByToken,
    changePassword,
    getVendorById,
    loginVendor,
    request_changeForgetPassword,
    updateVendor,
    forgetPasswordUserOtpValidation,
    verifyForgetPasswordVendor,
    deleteVendorProfile,

} = require("../controlers/vendorControler")
const { isVendorAuthenticated } = require("../middlewares/auth")
const { createBusiness, getBussiness ,     updateBusiness} = require("../controlers/vendor.businessControler")


vendorRouter.get("/", get_all_vendors)
vendorRouter.post("/register", register_vendor)
vendorRouter.post("/login", loginVendor)
vendorRouter.get("/info", isVendorAuthenticated, getVendorByToken)
vendorRouter.put("/update_profile", isVendorAuthenticated, upload.single("profileImage") , updateVendor)
vendorRouter.put("/change_password", isVendorAuthenticated, changePassword)
vendorRouter.get("/forget_password/send_otp/:email", verifyForgetPasswordVendor)
vendorRouter.post("/forget_password/validate_otp", forgetPasswordUserOtpValidation)
vendorRouter.post("/forget_password/request_change_password", request_changeForgetPassword)
vendorRouter.get("/info/:id", getVendorById)
vendorRouter.delete("/delete",isVendorAuthenticated,  deleteVendorProfile)



//business routes
vendorRouter.get("/business", isVendorAuthenticated ,  getBussiness)
vendorRouter.post("/business/new", isVendorAuthenticated , upload.any(), createBusiness)
vendorRouter.put("/business/update/:business_id", isVendorAuthenticated , upload.any(), updateBusiness)

module.exports = vendorRouter