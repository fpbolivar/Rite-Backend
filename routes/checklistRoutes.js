
const checkListRouter = require("express").Router()
const {get_all , newCheckBox, updateCheckbox } = require("../controlers/checklistControler")
 

checkListRouter.get("/" , get_all)
checkListRouter.post("/new" , newCheckBox)
checkListRouter.get("/update/:checkbox_id" , updateCheckbox)




module.exports = checkListRouter