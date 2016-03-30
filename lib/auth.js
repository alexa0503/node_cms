var User = require('../models/user.js'),
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err || !user) return done(err, null);
        console.log(user);
        done(null, user);
    });
});
var isValidPassword = function(user, password){
    var sha1 = crypto.createHash('sha1');
    sha1.update(password+'xFvfAWnUHEVuNf2b');
    password = sha1.digest('hex');
    console.log(password);
    return user.password === password;
    //return bCrypt.compareSync(password, user.password);
}
module.exports = function (app) {
    return {
        init: function () {
            passport.use('login', new LocalStrategy({
                    usernameField:'username',
                    passwordField:'password',
                    passReqToCallback: true
                },
                function (req, username, password, done) {
                    // check in mongo if a user with username exists or not
                    User.findOne({'username': username},
                        function (err, user) {
                            // In case of any error, return using the done method
                            if (err)
                                return done(err);
                            // Username does not exist, log error & redirect back
                            if (!user) {
                                console.log('User Not Found with username ' + username);
                                return done(null, false,
                                    req.session.flash('message', '不存在该账户'));
                            }
                            // User exists but wrong password, log the error
                            if (!isValidPassword(user, password)) {
                                console.log('Invalid Password');
                                return done(null, false,
                                    req.session.flash('message', '无效的密码~'));
                            }
                            console.log(req.isAuthenticated());

                            // User and password both match, return user from
                            // done method which will be treated like success
                            return done(null, user);
                        }
                    );
                })
            );
            app.use(passport.initialize());
            app.use(passport.session());
        },

        registerRoutes: function () {
            app.post('/login', passport.authenticate('login', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            }), function (req, res) {
                res.redirect('/');
            });
        },

    };
};
