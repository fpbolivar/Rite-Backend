const Category = require("../models/categoryModel")
const SubCategory = require("../models/subCategory")
const Checklist = require("../models/checklistModel")
const { ErrorResponse, SuccessResponse } = require("../helpers/responseService")
const singleCheckListModel = require("../models/singleCheckListModel")
const Business = require('../models/vendor/businesModel')




const get_all_categories = async (req, res) => {
  try {
    const all_categories = await Category.find().populate("subCategories")
    return SuccessResponse(res, all_categories)
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}


const create_new_category = async (req, res) => {
  try {
    const title = req.body.title ? `^${req.body.title}` : '';
    const categoryExists = await Category.find({ title: { $regex: new RegExp(title.trim(), 'i') } });
    console.log({ categoryExists })
    if (categoryExists.length > 0) {
      return ErrorResponse(res, `category with title ${req.body.title} alraedy exists !`)
    }

    const data = Category({
      title: req.body.title,
      icon: "/assets/" + req.file.filename
    })

    await data.save()
    return SuccessResponse(res, data)
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}





const addChecklist_toCategory = async (req, res) => {
  try {
    const { category_id } = req.params
    const { title, checked } = req.body
    const data = singleCheckListModel({ title, checked })
    await data.save()
    const checklist = await Checklist.findOne()
    console.log({ checklist })
    if (!checklist._id) {
      return ErrorResponse(res, "Failed to add Checklist  !")
    }
    checklist.byCategory.push({
      categoryReff: category_id,
      checkList: data._id
    })
    await checklist.save()
    return SuccessResponse(res, data)
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}

const create_new_subCategory = async (req, res) => {
  try {
    // console.log(req.body)
    const title = req.body.title ? `^${req.body.title}` : '';
    const subCatExists = await SubCategory.findOne({ $and: [{ title: { $regex: new RegExp(title.trim(), 'i') } }, { category: req.body.category }] })
    if (subCatExists) {
      return ErrorResponse(res, 'This Sub-Category already exists')
    }
    //  const data  = SubCategory(req.body)
    const data = SubCategory({
      title: req.body.title,
      category: req.body.category
    })
    const subCat = await data.save()
    const category = await Category.findById(req.body.category)
    if (!category) {
      return ErrorResponse(res, "No Category Found !")
    }
    // console.log({category})
    category.subCategories.push(subCat._id)
    await category.save()
    return SuccessResponse(res, data)
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}




const get_all_categoriesAlongWithBusiniess = async (req, res) => {
  try {
    const businesss = await Business.find()
    .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
    .populate({ path : "vendorRef" , select : "fullname email phone location"})
    console.log({businesss})
    const allBusinesses = businesss.reduce((acc, item) => {
      const category = item.category.title;
      acc[category] = acc[category] || [];
      acc[category].push(item);
      return acc;
    }, {});


    return SuccessResponse(res, allBusinesses)
  } catch (error) {
    console.log(error)
    return ErrorResponse(res, error.message)
  }
}





module.exports = {
  get_all_categories,
  create_new_category,
  create_new_subCategory,
  get_all_categoriesAlongWithBusiniess,
  addChecklist_toCategory,
} 
