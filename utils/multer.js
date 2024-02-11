const multer = require('multer');


 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
 const assetStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});



const upload = multer({ storage: storage });
const uploadAsset = multer({ storage: assetStorage });


module.exports =  {upload , uploadAsset};
