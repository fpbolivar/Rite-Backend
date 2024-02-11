const { SuccessResponse, ErrorResponse } = require("../helpers/responseService");
const Business = require("../models/vendor/businesModel")
const Vendor  = require("../models/vendor/vendorModel")
const User  = require("../models/user/userModel")
const Category  = require("../models/categoryModel")










// this will be filtered 
const getAllBusinesses = async (req,res) =>{
  const { country, state, city, category, price,query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {

        let filter = {};

        if (country) {
            filter['location.address.country'] = { $regex: new RegExp(country, 'i') };
        }
        if (query) {
            filter.title = { $regex: new RegExp(query, 'i') }
        }
        if (state) {
            filter['location.address.state'] = { $regex: new RegExp(state, 'i') };
        }
        if (city) {
            filter['location.address.city'] = { $regex: new RegExp(city, 'i') };
        }
          if (category) {
            filter['category'] =  category;
          }
        if (price) {
            filter['price'] = { $lte: Number(price) };
        }
      


        console.log({ filter })


        const totalCount = await Business.find(filter).count();

        const totalPages = Math.ceil(totalCount / pageSize);


            const businesses = await Business.find(filter).skip((page - 1) * pageSize).limit(pageSize)
            .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
            .populate({ path : "vendorRef" , select : "fullname email phone location"})
          return SuccessResponse(res, {businesses, totalPages , totalCount  , currentPage : page})
    } catch (error) {
        console.log({error})
          return ErrorResponse(res, error.message)
    }
}



const getBusinessByCategory = async (req, res) => {
    try {
      const { category_id } = req.params
      const businesss = await Business.find({ category: category_id })
      .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
      .populate({ path : "vendorRef" , select : "fullname email phone location"})
      // const allBusinesses = businesss.reduce((acc, item) => {
      //   const category = item.category.title;
      //   acc[category] = acc[category] || [];
      //   acc[category].push(item);
      //   return acc;
      // }, {});
  
  
      return SuccessResponse(res, businesss)
    } catch (error) {
      console.log(error)
      return ErrorResponse(res, error.message)
    }
  }
  


const getBusinessByCategoryTitle = async (req, res) => {
    try {
      const { category_title } = req.params
      const category = await Category.findOne({ title: new RegExp(category_title, 'i') });
      console.log({category})
      if (!category) ErrorResponse('No such category found');
      const businesss = await Business.find({ category: category._id })
      .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
      .populate({ path : "vendorRef" , select : "fullname email phone location"})
     
  
  
      return SuccessResponse(res, businesss)
    } catch (error) {
      console.log(error)
      return ErrorResponse(res, error.message)
    }
  }
  


// this will be filtered 
const businesDetails = async (req,res) =>{
    try {
        const { business_id } = req.params
        const businesses = await Business.findById(business_id).populate({ path : "vendorRef" , select : "fullname email phone location"}).populate({ path : "category" , select : "title"})
          return SuccessResponse(res, businesses)
    } catch (error) {
        console.log({error})
          return ErrorResponse(res, error.message)
    }
}





const deleteBusiness = async (req,res) =>{
    try {
        
          return SuccessResponse(res, "body")
    } catch (error) {
        console.log({error})
          return ErrorResponse(res, error.message)
    }
}





module.exports = {
    getAllBusinesses,
    getBusinessByCategoryTitle,
    businesDetails,
    getBusinessByCategory
};


