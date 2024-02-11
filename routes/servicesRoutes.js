const businessRouter = require("express").Router()
const {
    get_all_businesses,
    get_recently_added_businesses,
    filterByTitleAndDesc,
    create_new_Business,
    filterByCategory,
    get_busines_details
} = require("../controlers/businessControler")
const { isAuthenticated } = require("../middlewares/auth")
const upload = require("../utils/multer")



businessRouter.get("/", get_all_businesses)
businessRouter.get("/recently_added", get_recently_added_businesses)
businessRouter.get("/search", filterByTitleAndDesc)
businessRouter.get("/filterByCategory/:category_id", filterByCategory)
businessRouter.get("/details/:business_id", get_busines_details)
businessRouter.post("/create", isAuthenticated, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'attached_files', maxCount: 5 }]), create_new_Business)

module.exports = businessRouter