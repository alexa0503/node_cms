module.exports = function(app) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', isAuthenticated, function(req, res) {
        res.render('dashboard', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login',{layout:null});
    });


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isAuthenticated, function(req, res) {
        res.render('dashboard', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    
};

var isAuthenticated = function (req, res, next) {
    console.log(req.session);
    //console.log("session data", req.session);
    //console.log("user data", req.user);
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}