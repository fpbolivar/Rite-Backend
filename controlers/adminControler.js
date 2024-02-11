const { ErrorResponse, SuccessResponse } = require("../helpers/responseService");
const User = require("../models/user/userModel")


changeAccountStatus = async (req, res) => {
    const { user_id} = req.params
    try {
      const user = await User.findByIdAndUpdate(user_id, { accountStatus: req.body.status });
      if (!user) {
        return ErrorResponse(res, 'User Not Matched !');
      }
  
  
      SuccessResponse(res, user)
    } catch (error) {
  
      console.error('Error deleting user:', error);
      return ErrorResponse(res, error.message);
    }
  };
  



  deleteUserById = async (req, res) => {
    const {user_id} = req.params
    try {
      const user = await User.findByIdAndDelete(user_id);
      if (!user) {
        return ErrorResponse(res, 'User Not Matched !');
      }
  
  
      SuccessResponse(res, user)
    } catch (error) {
  
      console.error('Error deleting user:', error);
      return ErrorResponse(res, error.message);
    }
  };


module.exports = {
    changeAccountStatus,
    deleteUserById,
} 