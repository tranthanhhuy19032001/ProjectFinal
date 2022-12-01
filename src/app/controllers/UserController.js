const {mongooseToObject} = require('../../until/mongoose');
const {multipleMongooseToObject} = require('../../until/mongoose');
const User = require('../models/UserModel');
const Home = require('../models/HomeModel');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

//Filter image (chua toi uu)
const multerFilter = (req, file, cb) => {
  // console.log(file.mimetype);
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('File is not image', 400), false);
  }
};

//Upload file image
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

class UserController {
    
    info(req, res, next) {
        const currentUser = res.locals.user;
        res.render('user/thongtinnguoidung', {
            currentUser: mongooseToObject(currentUser)
        });
    }

    stored(req, res, next) {
        console.log(res.locals.user);
        // collection.countDocuments({ "_id": { "$exists": true } });
        
        let currentUser = res.locals.user;
        // const count = await Home.countDocuments({user: currentUser._id})
        // console.log(count);
        
      Promise.all([Home.find({ user: currentUser._id }), Home.countDocuments({user: currentUser._id})])
          .then(([homes, count]) => 
              res.render('user/newfeed', {
                  count,
                  homes: multipleMongooseToObject(homes),
                  currentUser: mongooseToObject(currentUser)
              })
          )
        // Home.find({ user: currentUser._id })
        //     .then(homes =>{
        //         res.render('user/newfeed', {
        //             currentUser: mongooseToObject(currentUser),
        //             homes: multipleMongooseToObject(homes)
        //         });
        // })


        // let newsId = newsOfUser.map((el) => el._id);
        // console.log(newsId)
        // const news = await Home.find({_id: {$in: newsOfUser}})
        // console.log(news)

        // newsId = Object.assign({}, [newsId]);

        // newsId.forEach(el =>{
        //     console.log(el)
        //     currentUser.home = newsId.map((el) => (el));
        // });
        

        
        // res.json(newsId)
        
    }
    edit(req, res, next) {
        let currentUser = res.locals.user;
        Home.findById(req.params.id)
            .then(home => res.render('user/edit',{
                home: mongooseToObject(home),
                currentUser: mongooseToObject(currentUser),
            }))
            .catch(next);
    }

    update(req, res, next) {
        upload.single('upFile')(req, res, (next) => {
            // console.log(req.file);
            sharp(req.file.buffer)
              .resize(214, 148)
              .toFormat('jpeg')
              .jpeg({ quality: 90 })
              .toFile(`./src/public/img/${req.file.originalname}`);
      
            let currentUser = res.locals.user;
            let formData = req.body;
            formData.images = req.file.originalname;
            formData.user = currentUser._id;
            Home.updateOne({_id: req.params.id}, formData)
            .then(() => res.redirect('/user/stored'))
            .catch(next);
      
        });
        
    }
    
    
}

module.exports = new UserController();

