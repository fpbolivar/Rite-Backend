const { SuccessResponse, ErrorResponse } = require('../helpers/responseService');
const privacyAndTerm = require('../models/privacyAndTerms')
const User = require('../models/user/userModel')


get_privacy_and_terms = async (req, res) => {
    try {
        const terms = await privacyAndTerm.find({ type: "TERMS" }).sort({ priority: 1 });
        const policy = await privacyAndTerm.find({ type: "PRIVACY" }).sort({ priority: 1 });

        return SuccessResponse(res, { policy, terms })
    } catch (error) {
        ErrorResponse(res, error.message)
    }
}

checkUserAgreedToPrivacy = async (req, res) => {

    try {
        const policy = await privacyAndTerm.findOne({ type: "PRIVACY" }).select(["priority", "version"]).sort({ priority: 1 });
        console.log({ policy })
        const user = await User.findById(req.user.id).select("agreed_to_policies")
        if (!user) {
            return ErrorResponse(res, "User Not Matched !")
        }
        return SuccessResponse(res, { agreed_to_policies: user.agreed_to_policies, policy_version: policy.version })
    } catch (error) {
        console.log(error)
        ErrorResponse(res, error.message)

    }

}

agree_to_policy = async (req, res) => {
    try {
        const { version } = req.body
        const policy = await privacyAndTerm.findOne({ type: "PRIVACY" }).select(["priority", "version"]).sort({ priority: 1 });
        const user = await User.findById(req.user.id).select("agreed_to_policies")
        console.log({ user })
        console.log({ version })


        user.agreed_to_policies = true
        user.agreed_to_policy_version = policy.version
        const updatedUser = await user.save()
        if (!updatedUser) {
            return ErrorResponse(res, "Something Went Wrong !")
        }

        return SuccessResponse(res, { agreed_to_policies: updatedUser.agreed_to_policies, policy_version: policy.version })
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}

createNew = async (req, res) => {

    try {
        const {
            title,
            version,
            type,
            privacyFor,
            priority,
            description
        } = req.body;
        console.log(req.body)
        // const pointsToMap = JSON.parse(req.body.points)

        // console.log({ pointsToMap })
        const newPrivacyAndTerm = new privacyAndTerm({
            title,
            priority,
            description,
            version,
            for: privacyFor,
            type,
            points: req.body.points
        });
        const savedPrivacyAndTerm = await newPrivacyAndTerm.save();
        const updatedUser = await User.updateMany({}, { $set: { agreed_to_policies: false } });

        res.status(201).json({ success: true, savedPrivacyAndTerm });
    } catch (error) {
        console.error(error);
        return res.json({
            Success: false,
            error: error.message,
        });
    }

}
updateOne = async (req, res) => {
    const id = req.params.id;
    try {
        const {
            title,
            version,
            type,
            privacyFor,
            priority,
            description
        } = req.body;
        console.log(req.body)
        const privacyExists = await privacyAndTerm.findById(id)
        if (!privacyExists) {
            return ErrorResponse(res , "Policy Doest Not Exists !")
        }
        console.log({ privacyExists })
        privacyExists.title = title
        privacyExists.priority = priority
        privacyExists.description = description
        privacyExists.version = version
        privacyExists.for = privacyFor,
        privacyExists.type = type
        // privacyExists.points = JSON.parse(req.body.points) // this should be unconmmented for production
        privacyExists.points =  req.body.points

        await privacyExists.save()
        const updatedUser = await User.updateMany({}, { $set: { agreed_to_policies: false } });
        res.json({ success: true })

    } catch (error) {
        console.error(error);
        return res.json({
            Success: false,
            error: error.message,
        });
    }

}

deleteOne = async (req, res) => {
    let id = req.params.id;
    try {
        const deletedPrivacy = await privacyAndTerm.findOneAndDelete({ _id: id })
        if (!deletedPrivacy) {
            return ErrorResponse(res , "Failed to delete Privacy  !")
        } else {
            return SuccessResponse(res, "Policy Deleted !")
        }

    } catch (error) {
        console.error(error);
         SuccessResponse(res, error.message)

    }
}

module.exports = {
    deleteOne,
    updateOne,
    createNew,
    agree_to_policy,
    checkUserAgreedToPrivacy,
    get_privacy_and_terms,
};
