const { SuccessResponse, ErrorResponse } = require("../helpers/responseService");
const Business = require("../models/vendor/businesModel")
const Vendor = require("../models/vendor/vendorModel")







const getBussiness = async (req, res) => {

    try {
        const businesses = await Business.find({ vendorRef: req.user.id })
        .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
        .populate({ path : "vendorRef" , select : "fullname email phone location"})
        return SuccessResponse(res, businesses)
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}





const createBusiness = async (req, res) => {
    try {
        console.log(req.body)
        console.log({ user: req.user })
        const {
            vendorRef,
            businessDetails,
            location,
            gallery,
            lowestPrice,
            boostDetails,
            category,
            subCategory,
            status,
            socialLinks
        } = req.body;

        const business =  Business({
            vendorRef,
            businessDetails,
            location,
            gallery,
            category,
            subCategory,
            lowestPrice,
            boostDetails,
            status,
            socialLinks
        })


        console.log({business})

        const vendor = await Vendor.findById(vendorRef)
        
        const newBusiness = await business.save()
        // if(vendor.business.includes()){
        vendor.business?.push(business._id)
        // }

        await vendor.save()

        const businesDetails = await Business.findById(business._id)
        .populate({ path : "category" , select : "-subCategories"}).populate("subCategory")
        .populate({ path : "vendorRef" , select : "fullname email phone location"})


        return SuccessResponse(res, newBusiness)
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}


const updateBusiness = async (req, res) => {
    try {
        const { business_id } = req.params

     const { title , description ,  email , website , phone  , location  , socialLinks} = req.body
      

        const images = req.files && req.files.length > 0 && req.files.filter((item) => item.fieldname === "images").map((item) => `/uploads/${item.filename}`)
        
        const videos = req.files && req.files.length > 0 && req.files.filter((item) => item.fieldname === "videos").map((item) => `/uploads/${item.filename}`)
        
        
        const business = await Business.findById(business_id)
        if (!business) return ErrorResponse(res ,'No Business Found')

        business.businessDetails.title = title !== "" && title || business.businessDetails.title
        business.businessDetails.description = description !== "" && description || business.businessDetails.description
        business.businessDetails.email = email !== "" && email || business.businessDetails.email
        business.businessDetails.website = website !== "" && website || business.businessDetails.website
        business.businessDetails.website = phone !== "" && phone || business.businessDetails.phone
        business.gallery.images  = images  && images.length > 0 && images || business.gallery.images 
        business.gallery.videos  = videos  && videos.length > 0 && videos || business.gallery.videos 
        business.location  = location  && JSON.parse(location) || business.location 
        business.socialLinks  = socialLinks  && JSON.parse(socialLinks) || business.socialLinks 

        await  business.save()
        return SuccessResponse(res,"Updated Succesfully!")

    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}

const deleteBusiness = async (req, res) => {
    try {

        return SuccessResponse(res, "body")
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}





module.exports = {
    getBussiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
};


