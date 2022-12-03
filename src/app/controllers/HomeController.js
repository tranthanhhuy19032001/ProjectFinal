const Home = require("../models/HomeModel");
const { multipleMongooseToObject } = require("../../until/mongoose");
const { mongooseToObject } = require("../../until/mongoose");
const sharp = require("sharp");
const multer = require("multer");
const jwt = require("jsonwebtoken");

// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
// });
// const upload = multer({dest: './src/public/img',
//     fileFilter:(req, file, callback) => {
//         console.log('111111')
//         callback(null, true)

//     }
// })

const multerStorage = multer.memoryStorage();

//Filter image (chua toi uu)
const multerFilter = (req, file, cb) => {
    // console.log(file.mimetype);
    if (file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("File is not image", 400), false);
    }
};

//Upload file image
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

class HomeController {
    // async index(req, res, next) {
    //     Home.find({})
    //         .then(homes => res.json(homes))
    //         .catch(error => console.log(error));
    // }
    // [GET] /huongdan
    huongdan(req, res, next) {
            // const numberPage = 3;
            const currentUser = res.locals.user;
            res.render("huongdan", {
                currentUser: mongooseToObject(currentUser),
            });
        }
        // [GET] /
    show(req, res, next) {
        // const numberPage = 1;
        console.log("555555555555555555555555555555555");
        const path = "homes/trangchu";
        const currentUser = res.locals.user;
        console.log(currentUser);
        Home.find({})
            .then((homes) =>
                res.render(path, {
                    homes: multipleMongooseToObject(homes),
                    currentUser: mongooseToObject(currentUser),
                })
            )
            .catch((error) => console.log(error));
    }

    // [GET] /create
    create(req, res, next) {
        const currentUser = res.locals.user;
        res.render("homes/dangtin", {
            currentUser: mongooseToObject(currentUser),
        });
    }

    //[POST] /create/store

    store(req, res, next) {
        upload.single("upFile")(req, res, (next) => {
            // console.log(req.file);
            sharp(req.file.buffer)
                .resize(214, 148)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`./src/public/img/${req.file.originalname}`);

            let currentUser = res.locals.user;
            let formData = req.body;
            formData.images = req.file.originalname;
            formData.user = currentUser._id;
            const home = new Home(formData);
            console.log(home);

            home
                .save()
                .then(() => res.redirect("/"))
                .catch((error) => console.log(error));
        });
    }

    //[GET] /chothuephongtro
    showPT(req, res, next) {
            const currentUser = res.locals.user;
            Home.find({})
                .then((homes) =>
                    res.render("homes/phongtro", {
                        homes: multipleMongooseToObject(homes),
                        currentUser: mongooseToObject(currentUser),
                    })
                )
                .catch(next);
            // console.log("666666666666666", res);
        }
        //[GET] /:slug
    chitietPT(req, res, next) {
            // const home = await Home.findOne({slug: req.params.slug});
            // console.log(home);
            const currentUser = res.locals.user;
            Home.findOne({ slug: req.params.slug })
                .then((home) =>
                    res.render("homes/chitiet", {
                        currentUser: mongooseToObject(currentUser),
                        home: mongooseToObject(home),
                    })
                )
                .catch(next);
        }
        //[GET] /dangnhap
    dangnhap(req, res, next) {
            res.render("login/dangnhap");
        }
        //[GET] /dangky
    dangky(req, res, next) {
        res.render("login/dangky");
    }
    research(req, res, next) {
        console.log(req.query);
        console.log(req.query.CategoryId);
        if (req.query.CategoryId == "1" || req.query.CategoryId == "") {
            return res.redirect("/chothuephongtro");
        }

        res.json(req.body);
    }
}

module.exports = new HomeController();