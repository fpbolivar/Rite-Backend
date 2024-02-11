
const adminRouter = require("express").Router()
const { changeAccountStatus , deleteUserById } = require("../../controlers/adminControler")
const { create_new_category, create_new_subCategory } = require("../../controlers/categoryControler")
const { isAuthenticated, verifyRole } = require("../../middlewares/auth")
const { uploadAsset } = require("../../utils/multer")
 

adminRouter.put("/change_account_status/:user_id", isAuthenticated , verifyRole("ADMIN") , changeAccountStatus)
adminRouter.get("/deleteUser/:user_id", isAuthenticated , verifyRole("USER") , deleteUserById)





adminRouter.post("/create/category" , isAuthenticated  , uploadAsset.single("icon")  , create_new_category )
adminRouter.post("/create/subCategory"    , isAuthenticated  , uploadAsset.single("icon"), create_new_subCategory)
module.exports = adminRouter