require("dotenv").config();
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 8001;
const { isAuthenticated, verifyRole } = require("./middlewares/auth");
require("./config/db")
const path = require('path')
const User = require('./models/user/userModel')
const fs = require('fs')
const Conversation = require('./models/user/conversationModel')

const Community = require('./models/user/communityModel')
const CommunityMessage = require('./models/user/communityMessageModel')
const Message = require('./models/user/messageModel')
var http = require('http');




const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const sharp = require('sharp')

var server = http.createServer(app);

const stripe = require('stripe')('sk_test_51KiiRNDs0edGSqAmcnTPzbYm945ppuerWhPzkCi0WBfRG60KWfciQtD4my0bpr0QjiJl7VcC4UTBfTPfbK1atdVD00S3PmIUI8');






const morgan = require('morgan');
const { default: axios } = require("axios");
const { upload } = require("./utils/multer");
const { ErrorResponse, SuccessResponse } = require("./helpers/responseService");

var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});





// importan middlewares
app.use(cors());
app.use(express.static('/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static('/public'));
app.use(express.static(__dirname + '/public', { maxAge: '30 days' }));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));







const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 50 requests per windowMs for this specific route
  message: 'Too many requests for this API, please try again later.'
});

app.use(requestIp.mw());

app.use((req, res, next) => {
  const clientIP = req.clientIp;

  // Use GeoIP to get location information
  const geoInfo = geoip.lookup(clientIP);


  console.log(`Client IP: ${clientIP}`);
  console.log('Location Information:', geoInfo);

  // You can now use geoInfo to access location details such as country, region, city, etc.

  next();
});




const connectedUser = [];
const generateRoomId = (createdBy, createdFor, reff) => {
  const sortedUserIds = [createdBy, createdFor, reff];
  const roomId = sortedUserIds.join('_');
  return roomId;
};







const verifyUserToJoinRoom = (userId, roomIdString) => {
  const usersToArray = roomIdString.split('_')
  const userExits = usersToArray.includes(userId);
  return userExits;
};

io.on('connection', async (socket) => {
  console.log("socket connection initiated ")
  let userJoinId;

  // Handling user connection
  if (socket.handshake.query.userid) {
    userJoinId = socket.handshake.query.userid;
    if (!connectedUser.includes(userJoinId)) {
      connectedUser.push(userJoinId)
    }
    console.log({ connectedUser })

    try {
      const user = await User.findOne({ _id: userJoinId });

      if (user) {
        user.onlineStatus = true;
        await user.save();
      }
    } catch (error) {
      console.error(error);
    }
  }







  // Handling user disconnection
  socket.on('disconnect', async () => {
    if (userJoinId) {
      try {
        const user = await User.findOne({ _id: userJoinId });

        if (user) {
          user.onlineStatus = false;
          await user.save();
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
});










// routes configurations
app.use("/api", require("./routes/index"))
// app.use("/api/dashboard" , require("./routes/dashboard-api/index"))





app.post("/api/user/conversations/sendMessage", upload.any(), async (req, res) => {
  try {


    console.log(req.files)
    const { conversationId, message , sender , receiver } = req.body
    console.log(req.body)
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return ErrorResponse(res, "Conversation Not Found !")
    }
    
    if (!sender || !receiver) {
      return ErrorResponse(res, "Sender / Receiver Not Found !")
    }

    const images = req.files && req.files.length > 0 && req.files.filter(item => item.fieldname === "images").map((image) =>{
     return  `/uploads/${image.filename}`
    })


    console.log({images})




    const newMessage = Message({
      senderId: sender,
      receiverId: receiver,
      conversationId,
      images: images && images.length > 0 ? images : [],
      message: message ? message : null
    })


    console.log({newMessage})
    conversation.messages.push(newMessage._id)
    conversation.lastMessage= newMessage._id

    await conversation.save()
    await newMessage.save()
    console.log({receiver})
    io.to(receiver).to(sender).emit("newMessage", newMessage)
    return SuccessResponse(res, newMessage)



  } catch (error) {
    console.log({ error })
    return ErrorResponse(res, error.message)
  }

})





app.post("/api/community/sendMessage", upload.any(), isAuthenticated, async (req, res) => {
  try {


    const { community_id , message  } = req.body
    const community = await Community.findById(community_id)
    if (!community) {
      return ErrorResponse(res, "community Not Found !")
    }
    
    
    const images = req.files && req.files.length > 0 && req.files.filter(item => item.fieldname === "images").map((image) =>{
     return  `/uploads/${image.filename}`
    })


    console.log({images})




    const newMessage = CommunityMessage({
      userReff : req.user._id,
      images: images && images.length > 0 ? images : [],
      commnityReff : req.user.id,
      message: message ? message : null
    })


    console.log({newMessage})
    community.discusssion.push(newMessage._id)
    images && images.length > 0 &&   community.images.push(...images)

    await community.save()
    await newMessage.save()
    // io.to(receiver).to(sender).emit("newMessage", newMessage)
    return SuccessResponse(res, newMessage)



  } catch (error) {
    console.log({ error })
    return ErrorResponse(res, error.message)
  }

})





app.get("/pay", async (req, res) => {

  const { data }  = await axios.get("https://dummyjson.com/products?limit=4")
  const products  = data.products

  const session = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:9001/sucess',
    cancel_url: 'http://localhost:9001/cancel',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    custom_text: {
      shipping_address: {
        message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
      },
      submit: {
        message: 'We\'ll email you instructions on how to get started.',
      },
    },
    line_items: products.map((item) =>  {
        return {
            price_data: {
              currency: "USD",
              product_data: {
                name: item.title,
                description:item.description,
                images:item.images,
              },
              unit_amount: item.price,
            },
            quantity: 2,
           }
      
    }),
    phone_number_collection: {
      enabled: true,
    },
    mode: 'payment',
  });

  console.log({session})

  res.redirect(session.url)
})


app.get("/sucess", async (req, res) => {
  res.status(200).json({ Success: true, body: "sucess :)" })
})

app.get("/cancel", async (req, res) => {
  res.status(200).json({ Success: true, body: "sucess :)" })
})






// Function to read text from a specific region of an image file
function readTextFromImageRegion(imagePath, rect) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imagePath,
      'eng', // Specify language (English in this case)
      {
        logger: info => console.log(info), // Logger function for debug information
        rect: rect // Specify the region coordinates (e.g., { left: 100, top: 100, width: 200, height: 100 })
      }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch(err => {
      reject(err);
    });
  });
}

// app.get("/ai", apiLimiter,  async (req, res) => {

//     // const worker = await createWorker('eng');
//     // const ret = await worker.recognize('public/uploads/1701843766324_Screenshot (2).png');
//     // console.log(ret.data.text);
//     // await worker.terminate();

// // Specify the region coordinates (left, top, width, height)
// const regionCoordinates = { left: 390, top: 300, width: 20, height: 10 };

// readTextFromImageRegion(imagePath, regionCoordinates)
//   .then(text => {
//     console.log('Text from the specified region:', text);
//   })
//   .catch(err => {
//     console.error('Error reading text from the specified region:', err);
//   });
//   res.send("okayyy")
// })



// async function removeBackgroundColor(inputImagePath, outputImagePath, targetColor) {
//   try {
//     const image = await sharp(inputImagePath)
//       .resize(39) // Adjust the size if needed
//       .removeAlpha() // Remove alpha channel, if any
//       .toBuffer({ resolveWithObject: true });

//     const { data, info } = image;

//     // Create a mask for pixels matching the target color
//     const mask = Buffer.alloc(data.length / 4);

//     for (let i = 0; i < data.length; i += 4) {
//       const pixelColor = [data[i], data[i + 1], data[i + 2]];
//       mask[i / 4] = compareColors(pixelColor, targetColor) ? 0 : 255;
//     }

//     // Apply the mask to the alpha channel
//     const maskedImage = await sharp(Buffer.from(data), { raw: { width: info.width, height: info.height, channels: 4 } })
//       .joinChannel(mask, { raw: { width: info.width, height: info.height, channels: 1 } })
//       .toFile(outputImagePath);

//     console.log('Background color removed successfully:', outputImagePath);
//   } catch (error) {
//     console.error('Error removing background color:', error);
//   }
// }

// function compareColors(color1, color2) {
//   // Compare RGB values of two colors
//   return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
// }


app.get("/", async (req, res) => {
//   const inputImagePath = 'public/uploads/IMG_20231213_094535.jpg';
// const outputImagePath = 'public/out.jpg';
// const targetColor = [255, 255, 255]; // Replace with the RGB values of your target background color

// removeBackgroundColor(inputImagePath, outputImagePath , targetColor);
  res.status(200).json({ Success: true, body: "server is running ..." })
})


app.get('/admin', isAuthenticated, verifyRole("ADMIN"), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});


app.get("/*", async (req, res) => {
  res.status(404).json({ Success: false, error: "No Route Found !" })
})

server.listen(PORT, () => {
  console.log(`Server is running  on :  http://localhost:${PORT}`)
})







// [
      

//   {
//     price_data: {
//       currency: "USD",
//       product_data: {
//         name: "mobile ",
//       },
//       unit_amount: 4000,
//     },
//     quantity: 2,
//   },
//   {
//     price_data: {
//       currency: "USD",
//       product_data: {
//         images : ["https://images.unsplash.com/photo-1421986527537-888d998adb74?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
//         name: "laptop",
//         description: "a very smooth mobile phohe",
//       },
//       unit_amount: 4000,
//     },
//     quantity: 2,
//   }
// ],