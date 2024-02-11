
const privacyAndTermsRouter = require("express").Router()
const { isAuthenticated, verifyRole } = require("../middlewares/auth")
const { get_privacy_and_terms , createNew ,agree_to_policy , checkUserAgreedToPrivacy ,updateOne}  = require('../controlers/privacyAndTermsControler')
  

privacyAndTermsRouter.get("/", isAuthenticated , verifyRole("USER") , get_privacy_and_terms)
privacyAndTermsRouter.post("/create", isAuthenticated , verifyRole("USER") , createNew)
privacyAndTermsRouter.put("/agree_to_policy", isAuthenticated , verifyRole("USER") , agree_to_policy)
privacyAndTermsRouter.delete("/deleteOne/:id", isAuthenticated , verifyRole("USER") , deleteOne)
privacyAndTermsRouter.get("/check_user", isAuthenticated , verifyRole("USER") , checkUserAgreedToPrivacy)
privacyAndTermsRouter.put("/updateOne/:id", isAuthenticated , verifyRole("USER") , updateOne)



module.exports = privacyAndTermsRouter