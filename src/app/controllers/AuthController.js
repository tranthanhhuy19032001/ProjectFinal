const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/UserModel");
const { mongooseToObject } = require("../../until/mongoose");
const { showAlert } = require("../../until/alerts");

const signToken = (id) => jwt.sign({ id }, "secret", { expiresIn: 60 * 60 });

const createSendToken = (user, req, res, next) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 60 * 60 * 60 * 24 * 7),
        httpOnly: true,
    };

    // if (process.env.NODE_ENV === "production") {
    //   cookieOptions.secure = true;
    // }

    res.locals.user = user;
    console.log(res.locals.user);
    user.password = undefined;
    // console.log(cookieOptions);
    // console.log('1 Create token');
    res.cookie("jwt", token, cookieOptions);
    // res.send({data: res.locals.user})
    // res.redirect('partials/header', {
    //     user: res.locals.user
    // })
    res.redirect("/");
};

class AuthController {
    async signup(req, res, next) {
        // res.json(req.body);
        const { name, email, password, passwordConfirm } = req.body;
        const emaiex = await User.findOne({ email });

        if (await User.findOne({ email })) {
            return next(
                new Error("Email existed! Please enter difference email", 400)
            );
        }
        if (await (req.body.password != req.body.confirmPassword)) {
            return next(
                new Error("Password is difference with Password Confirm", 401)
            );
        }
        const newUser = await User.create(req.body);
        newUser.password = undefined;
        newUser.passwordConfirm = undefined;
        res.redirect("/dangnhap");
    }

    async isLoggedIn(req, res, next) {
        // console.log("22222222222222222222222222")
        if (req.cookies.jwt) {
            try {
                // console.log("3333333333333333333")
                //1) Verification token
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, "secret");
                // console.log(decoded);
                //2) Check if user still exist
                const currentUser = await User.findById(decoded.id);
                if (!currentUser) {
                    next();
                }
                //3) Check if user changed password after the token was issued
                // if (currentUser.changedPasswordAfter(decoded.iat)) {
                //   next();
                // }
                req.user = currentUser;
                res.locals.user = currentUser;

                return next();
            } catch (err) {
                console.log("444444444444444444444444");
                console.log(err);
                return next();
            }
        }
        next();
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        //1)Check if email and password exist
        if (!email || !password) {
            return next(new Error("Email or Password are not exist"));
        }
        //2)Check if user exists && password are correct
        const user = await User.findOne({ email }).select("+password");
        console.log(user);
        if (!user) {
            return next(
                new Error("Your email is not exist! Please re-enter your email!")
            );
        }
        //error: because if User.findOne({ email }).select('+password') NOT EXIST
        // const correct = await user.correctPassword(password, user.password);

        if (!email || !(await user.correctPassword(password, user.password))) {
            return next(new Error("Email or Password are not correct", 401));
            // return showAlert("error", "Email or password are not exist!");
        }

        // console.log(user);
        //3) If everything is OK, send token to client
        createSendToken(user, req, res, next);

        // res.render('homes/trangchu', {
        //     user: mongooseToObject(user)
        // })
        // res.render('homes/trangchu', {user: mongooseToObject(user)} , function(req, res, next) {
        //     createSendToken(user, req, res, next)
        // })
    }
    logout(req, res, next) {
        res.clearCookie("jwt");

        //ERROR: ...
        // res.cookie("jwt", "loggedout", {
        //   expires: new Date(Date.now() + 10 * 1000),
        //   httpOnly: true,
        // });
        res.redirect("/");
    }
    async protect(req, res, next) {
        console.log("3 protect");
        try {
            let token;
            // 1) Getting token and check it's there.
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                token = req.headers.authorization.split(" ")[1];
                // console.log(token);
            } else if (req.cookies.jwt) {
                token = req.cookies.jwt;
            }
            console.log(token);
            if (token === null || token === undefined) {
                console.log("not exist token");
                return res.render("login/dangnhap");
            }
            //2) Verification token
            const decoded = await promisify(jwt.verify)(token, "secret");
            // console.log(decoded);

            //3) Check if user still exist
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return res.render("login/dangnhap");
            }

            //4) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //   return res.render('/dangnhap')
            // }
            req.user = currentUser;
            console.log(req.user);
            res.locals.user = currentUser;

            return next();
        } catch (err) {
            return next();
        }
        next();
    }
}

module.exports = new AuthController();