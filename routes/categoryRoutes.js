
const categoryrouter = require("express").Router()
const {get_all_categories , create_new_category ,
     create_new_subCategory ,
     get_all_categoriesAlongWithBusiniess,
     getBusinessByCategory,
       addChecklist_toCategory, 
     } = require("../controlers/categoryControler")
 

categoryrouter.get("/" , get_all_categories)
categoryrouter.get("/with_business" , get_all_categoriesAlongWithBusiniess)
categoryrouter.post("/addCheckbox/:category_id" , addChecklist_toCategory)


module.exports = categoryrouter