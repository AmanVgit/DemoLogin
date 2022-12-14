var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/user_auth");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//====================================================
//ROUTES
//====================================================

app.get("/", function(req, res){
    res.render("home")
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secretPage")
});

//Auth Route
//Show the Form

app.get("/register", function(req, res){
    res.render("register")
});


app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err)
            res.render("register")
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
                });
        }
        
    })
});

//LOGIN Routes

app.get("/login", function(req,res){
    res.render("login")
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) , function(req, res){
    
});

//LOGOUT Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

app.get("/food", function (req, res) {
    res.render("Food");
})
app.get("/cosmetic", function (req, res) {
    res.render("cosmetic");
})




app.listen(3000, function(){
    console.log("Server started at Port 3000")
});