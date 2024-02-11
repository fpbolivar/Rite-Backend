require("dotenv").config();
const apiRouter = require("express").Router()

const userRouter = require("./userRoutes")
const categoryrouter = require("./categoryRoutes")

const privacyAndTermsRouter = require('./privacyAndTermsRoutes')
const adminRouter = require("./admin/adminRoutes");
const vendorRouter = require("./vendorRoutes");
const checkListRouter = require("./checklistRoutes");
const businessRoter = require("./businessRoutes");



apiRouter.use("/user" , userRouter)
apiRouter.use("/checklist" , checkListRouter)
apiRouter.use("/admin" , adminRouter)
apiRouter.use("/privacy_and_terms" , privacyAndTermsRouter)
apiRouter.use("/category" , categoryrouter)
apiRouter.use("/vendor" , vendorRouter)
apiRouter.use("/business" , businessRoter)


module.exports = apiRouter