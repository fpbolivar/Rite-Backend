const User = require('../models/user/userModel')
const Funeral = require('../models/user/funeralModel')
const Event = require('../models/user/eventModels')
const Guest = require('../models/user/guestModel')
const UserBooking = require('../models/user/userBookingModel')
const Checklist = require('../models/checklistModel')

const { ErrorResponse, SuccessResponse } = require('../helpers/responseService')




const new_funeral = async (req, res) => {
    try {

        const { name, 
            funeral_date,
            starting_time,
            ending_time,
            venue
        } = req.body
        console.log(req.body)
        console.log(req.files)
        const startTime = new Date(`${funeral_date} ${starting_time}`);
        const endTime = new Date(`${funeral_date} ${ending_time}`);
        console.log({startTime})
        const image = req.files ? req.files[0]?.filename : ""
        const user = await User.findById(req.user.id)
        if (!user) {
            return ErrorResponse(res, "User Not Matched !")
        }

        const selectedCheckBoxes = await Checklist.find({ type: "FUNERAL" });
        const selectedList = selectedCheckBoxes.map(item => ({ title: item.title }));

        const list = await Checklist.insertMany(selectedList);
        console.log({ list })
        console.log({ selectedList });

        const listIds = list.map((item) => item._id)
        console.log({ listIds })


        const body = await Funeral({
            name,
            funeral_date,
            starting_time : startTime,
            checklist: listIds,
            ending_time : endTime,
            image: `/uploads/${image}`,
            createdBy: req.user.id

        }).save()

        const populatedFuneral = await Funeral.findById(body._id).populate("checklist")
        console.log({populatedFuneral})
        return SuccessResponse(res, populatedFuneral)
    } catch (error) {
        console.log(error)
        ErrorResponse(res, error.message)
    }
}



const update_funeral = async (req, res) => {
    try {
        const funeralId = req.params.funeral_id;
        const {
            name,
            funeral_date,
            starting_time,
            ending_time
        } = req.body;
        console.log(req.body);

        const startTime = new Date(`${funeral_date} ${starting_time}`);
        const endTime = new Date(`${funeral_date} ${ending_time}`);
        console.log(req.files);

        const image = req.files ? req.files[0]?.filename : "";
        console.log({ image })

        const funeral = await Funeral.findById(funeralId);
        if (!funeral) {
            return ErrorResponse(res, "Funeral Not Found!");
        }

        if (funeral.createdBy.toString() !== req.user.id) {
            return ErrorResponse(res, "Unauthorized: You do not have permission to update this funeral.");
        }

        const update = {};
        if (name) update.name = name;
        if (funeral_date) update.funeral_date = funeral_date;
        if (starting_time) update.starting_time = startTime;
        if (ending_time) update.ending_time = endTime;
        if (image) update.image = `/uploads/${image}`;
        // if (guests) update.guests = JSON.parse(guests);
        // if (business) {
        //     update.$addToSet = { bookings: business };
        // }


        const updatedFuneral = await Funeral.findByIdAndUpdate(funeralId, update, { new: true }).populate("checklist");

        return SuccessResponse(res, updatedFuneral);
    } catch (error) {
        console.log(error);
        ErrorResponse(res, error.message);
    }
};







const addEvent = async (req, res) => {
    try {
        const { title, date, funeral_id } = req.body
        const funeral = await Funeral.findById(funeral_id).select('events').populate("events")
        if (!funeral) {
            return ErrorResponse(res, "This funeral does not exist")
        }

        const body = Event({
            title,
            date,
            funeralReff: funeral_id
        })

        const eventExists = funeral.events?.some(item => item.title.toUpperCase() === title.toUpperCase());

        if (eventExists) {
            return ErrorResponse(res, "Event Already Exists !")
        } else {
            await body.save();
            funeral.events = funeral.events || [];
            funeral.events.push(body._id);
            await funeral.save()
            return SuccessResponse(res, "success")
        }

    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}



const addGuest = async (req, res) => {
    console.log(req.body)
    try {
        const { name, phone, email, events } = req.body
        if (!name || name == "") {
            return ErrorResponse(res, "Name field is Mendatory !")
        }
        if (!phone || phone == "") {
            return ErrorResponse(res, "Phone field is Mendatory !")
        }
        if (!events || events.length < 1) {
            return ErrorResponse(res, "Select at least One Event !")
        }
        const parsedEvents = events && JSON.parse(events)

        const guest = await Guest.create({ name, email, phone });

        await Promise.all(parsedEvents.map(eventId =>
            Event.findByIdAndUpdate(eventId, { $push: { guests: guest._id } }, { new: true })
        ));


        return SuccessResponse(res, "succcess")
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}



const getFuneralDetails = async (req, res) => {
    try {
        const { funeral_id } = req.params
        const funeral = await Funeral.findById(funeral_id)
            .populate({
                path: "events",
                select: "-funeralReff",
                populate: { path: "guests" }
            })
            .populate({
                path: "checklist"
            })
            .populate({
                path: "bookings",
                populate: [
                    { path: "userReff", select: "fullname email phone" },
                    { path: "businessReff", select: "businessDetails" },
                    { path: "funeralReff", select: "name" }]
            });

        return SuccessResponse(res, funeral)
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}


const addEventxxxx = async (req, res) => {
    try {

        return SuccessResponse(res, "succcess")
    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}
const bookABusiness = async (req, res) => {
    try {
        console.log(req.body)

        const {  bookingDate, bookingStartTime, bookingEndTime, description, funeralReff, businessReff } = req.body;

        const startTime = new Date(`${bookingDate} ${bookingStartTime}`);
        const endTime = new Date(`${bookingDate} ${bookingEndTime}`);
        console.log({ startTime })
        console.log({ endTime })

        const user = await User.findById(req.user.id)
        const funeral = await Funeral.findById(funeralReff).select('bookings').populate("bookings")
        console.log({ funeral })
        if (!user) {
            return ErrorResponse(res, "No user Exits !")
        }
        if (!funeral) {
            return ErrorResponse(res, " NO Funeral Exits !")
        }

        const booking = UserBooking({
            userReff: req.user.id,
            bookingDate,
            bookingStartTime: startTime,
            bookingEndTime: endTime,
            description,
            funeralReff,
            businessReff

        })

     

        const bookingExists = funeral.bookings && funeral.bookings.length > 0  && funeral.bookings.some((item) => item.businessReff.toString() === businessReff)
        if (bookingExists) {
            return ErrorResponse(res, "You already have booking this business!")
        } else {

            funeral.bookings.push(booking._id);
            await funeral.save()
            await booking.save()
            return SuccessResponse(res, booking)
        }


    } catch (error) {
        console.log({ error })
        return ErrorResponse(res, error.message)
    }
}



module.exports = {
    new_funeral,
    getFuneralDetails,
    addEvent,
    bookABusiness,
    addGuest,
    update_funeral
}