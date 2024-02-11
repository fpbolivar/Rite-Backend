const userRouter = require("express").Router()
const bodyParser = require('body-parser');
const {
     registerUser,
    loginUser,
    toggle_wishlist,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    getAllDonations,
    verifyForgetPasswordUser,
    request_changeForgetPassword,
    createComunity,
    getAllCommunities,
    get_services_wishlist,
    requestCustomerSupport,
    check_service_in_wishlist,
    createDonation,
    report_user,
    forgetPasswordUserOtpValidation,
    continue_with_google,

} = require("../controlers/userControler");
const { isAuthenticated } = require("../middlewares/auth");
const {upload} = require('../utils/multer');
const { new_funeral, update_funeral, addEvent , addGuest , getFuneralDetails ,bookABusiness } = require("../controlers/funeralControler");


// important middlewares
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: true }));





userRouter.post('/login', loginUser);




userRouter.post("/register",  registerUser)
userRouter.post("/continue_with_google",  continue_with_google)
userRouter.get("/forget_password/check_user/:email",  verifyForgetPasswordUser)
userRouter.post("/forget_password/validate_otp/", forgetPasswordUserOtpValidation)
userRouter.post("/forget_password/request_change_password", request_changeForgetPassword)
userRouter.put("/update_user", isAuthenticated, upload.single("profileImage"), updateUser)
userRouter.get("/getUserById/:id", getUserById)




//comunity routes
userRouter.post("/community/new", isAuthenticated,  upload.single("thumbnail") , createComunity)
userRouter.get("/community/all", isAuthenticated,   getAllCommunities)


userRouter.get("/getUserFromToken", isAuthenticated, getUserFromToken)
userRouter.delete("/delete_user", isAuthenticated, deleteUser)
userRouter.put("/changePassword", isAuthenticated, changePassword)
userRouter.get("/toggle_wishlist/:business_id/:type", isAuthenticated, toggle_wishlist)
userRouter.get("/wishlist", isAuthenticated, get_services_wishlist)
userRouter.get("/wishlist_check/:business_id", isAuthenticated, check_service_in_wishlist)
userRouter.post("/needs_support", isAuthenticated,  upload.array("files" , 5), requestCustomerSupport)


// report user
userRouter.post("/report_user/:user_id", isAuthenticated, report_user)


//// donation
userRouter.post("/donation/new",  isAuthenticated,  upload.any(), createDonation)
userRouter.get("/donation/all",  isAuthenticated,  upload.any(), getAllDonations)



// funeral
userRouter.post("/funeral/new", isAuthenticated, upload.any(), new_funeral)
userRouter.post("/funeral/booking/new", isAuthenticated, upload.any(), bookABusiness)
userRouter.post("/funeral/addEvent", isAuthenticated, upload.any(), addEvent)
userRouter.get("/funeral/details/:funeral_id", isAuthenticated, upload.any(), getFuneralDetails)
userRouter.post("/funeral/addGuest", isAuthenticated, upload.any(), addGuest)
userRouter.put("/funeral/update/:funeral_id", isAuthenticated, upload.any(), update_funeral)






module.exports = userRouter