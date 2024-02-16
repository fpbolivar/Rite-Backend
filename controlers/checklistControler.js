const { ErrorResponse, SuccessResponse } = require("../helpers/responseService");
const User = require("../models/user/userModel")
const Funeral = require('../models/user/funeralModel')
const Checklist = require('../models/checklistModel')


const get_all = async (req, res) => {
  try {
    const checklist = await Checklist.findOne()
    // const checklist = new Checklist()
    // await checklist.save()
    SuccessResponse(res, checklist)
  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};

const newCheckBox = async (req, res) => {
  try {
    const { title , type , funeral_id} = req.body
   
    
    if(type === "UPDATE_FUNERAL"){
      if(!funeral_id){
        return ErrorResponse(res, 'Funeral Id is required !')
      }
      const checkbox =  Checklist({  title  , isChecked : true})
      const funeral = await Funeral.findById(funeral_id)
      funeral.checklist.push(checkbox._id)
      await checkbox.save()
      await funeral.save()
      return SuccessResponse(res, checkbox)
    }else if(type === "FUNERAL_DEFAULT" ) {
      const checkbox =  await Checklist({  title , type}).save()
      SuccessResponse(res, checkbox)
    }


  } catch (error) {

    console.error('Error deleting user:', error);
    return ErrorResponse(res, error.message);
  }
};



const updateCheckbox = async (req, res) => {
  try {
    const { checkbox_id } = req.params;
    let checked ;
    const funeral = await Funeral.findOne({createdBy : req.user.id})

    if (!funeral) {
      return ErrorResponse(res, "Checkbox not found");
    }
    // checkbox.isChecked = !checkbox.isChecked;
    if (funeral.checklist.includes(checkbox_id)) {
      const filtertedChecklist  = funeral.checklist.filter(item => item.toString() !== checkbox_id.toString())
      checked = false
      funeral.checklist = filtertedChecklist
    } else {
      checked = true
      funeral.checklist.push(checkbox_id)
    }
    await funeral.save();   
    const checkbox = await Checklist.findById(checkbox_id)
    SuccessResponse(res, {...checkbox._doc , isChecked : checked });
  } catch (error) {
    console.error('Error toggling checkbox:', error);
    return ErrorResponse(res, error.message);
  }
};


module.exports = {
  get_all,
  newCheckBox,
  updateCheckbox,
} 