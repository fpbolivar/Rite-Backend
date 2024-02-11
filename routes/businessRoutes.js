
const businessRoter = require("express").Router()
const { getAllBusinesses, businesDetails  , getBusinessByCategory , getBusinessByCategoryTitle } = require("../controlers/businessControler")
const { upload } = require('../utils/multer')


businessRoter.get("/all" , getAllBusinesses)
businessRoter.get("/getByCategory/:category_id" , getBusinessByCategory)
businessRoter.get("/getByCategoryTitle/:category_title" , getBusinessByCategoryTitle)
businessRoter.get("/details/:business_id" , businesDetails)

module.exports = businessRoter