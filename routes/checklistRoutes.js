
const checkListRouter = require("express").Router()
const {get_all , newCheckBox, updateCheckbox } = require("../controlers/checklistControler")
const { isAuthenticated } = require("../middlewares/auth")
 

checkListRouter.get("/" , get_all)
checkListRouter.post("/new" , newCheckBox)
checkListRouter.get("/update/:checkbox_id"  , isAuthenticated, updateCheckbox)




module.exports = checkListRouter