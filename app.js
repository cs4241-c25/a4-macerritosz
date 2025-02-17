import express from "express";

import {MongoClient} from "mongodb";

import path from "path";

import passport from "passport";

import session from "express-session";

import LocalStrategy from "passport-local";

const contentHelper = require('./contentHelper');
const app = express();
let {count} = require("./contentHelper");

// MongoDB connection details
const url = "mongodb+srv://mcerr0504:VsNltzRJq2ICSaX1@cs4241-c25-mac.iigc3.mongodb.net/";
const dbCnxtn = new MongoClient(url);
let flightCollection = null;
let loginCollection = null;

//parse the data that comes in
app.use(express.json());
//sends the files in public folder
app.use(express.static(path.join(__dirname, 'public')));

//passport middleware, allows you to save the login for the user
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//User validated
async function connect() {
    await dbCnxtn.connect().then(() => {console.log("Connected!")});
    flightCollection = await dbCnxtn.db("FlightStorage").collection("FlightStorage");

    let db = dbCnxtn.db("FlightStorage");

    const checkExists = await db.listCollections({name:'loginData'}).toArray()
    if(checkExists.length === 0){
        db.createCollection("loginData", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Login Object Validation",
                    required: [ "username", "password" ],
                    properties: {
                        username: {
                            bsonType: "string",
                            description: "'name' must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "'password' must be a string and is required"
                        }
                    }
                }
            }
        } )
        console.log("Successfully Creates user collection w/ schema validation")
    }
    loginCollection= db.collection("loginData");
}
connect().then(() => {
    app.use(passport.initialize());
    app.use(passport.session());
});
app.use(passport.authenticate('session'));
/*
Verification done by checking mongodb db userDB and checking the password provided agaisnt one on file
 */
passport.use(new LocalStrategy(async function verify(username, password, cb) {

    try {
        const user = await loginCollection.findOne({username: username})
        console.log(user);
        if (!user) {
            return cb(null, false, {message: 'Incorrect username or password.'});
        }

        if (user.password === password) {
            return cb(null, user);
        } else {
            return cb(null, false, {message: 'Incorrect username or password'});
        }
    } catch (err) {
        if (err) { return cb(err); }
    }
}));

// Serializing user into session
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            id: user.id,
            username: user.username
        });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

//Uses the authenticate fnc to call the strategy I defined before, makig sure it matches and then saves the user info to the session
app.post('/login', function (req,res,next) {
    console.log('Request body:', req.body);
    passport.authenticate('local', function (error, user) {
        if (error) {
            console.error('Authentication error:', error);
            return next(error);
        }
        if (!user) {
            console.log('Login failed: Incorrect username or password');
            return res.status(401).json({error: 'Incorrect username or password.'});
        }
        console.log("got here")
        req.login(user,function(err) {
            if (err) {
                console.error('Session error:', err)
                return next(err);
            }
            return res.status(200).json({success: "Login successful"});
        });

    })(req,res,next)
});

//create routes for http requests and buttons
app.post('/signup', async function (req, res) {
    /*
    Create user sign up data by inserting into database, use .findOne to check if username has not been used before
     */
    const loginExists = await loginCollection.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if(!loginExists) {
        const results = await loginCollection.insertOne(req.body);
        console.log(results);
        res.send("Signup Successful");
    } else {
        console.log("Could not create signup");
        res.send("User already exists");
    }
})

app.post('/submit', async function (req, res) {
    /*
    submit data into the flight collection: since there can be repeats, validation not necessary, modify body str to add data modification
     */
    let daysUntil = contentHelper.checkDaysTil(req.body);
    //assign value to data before pushing to db
    req.body.daysTil = daysUntil;
    //get user information from session
    let flightIndex = contentHelper.count
    const mergedJSON = {...{username:req.user.username}, ...{flightID : flightIndex},...req.body}
    console.log(mergedJSON)
    await flightCollection.insertOne(mergedJSON, (err) => {
        if(err){
            res.send('Error');
        } else  {
            res.send('success');
        }
    })
    /*
    Flight Data will have associated user added with it, and an ID which will also be passed to button look into ES6 reading for the user thing
     */
    let htmlString = contentHelper.addFlightData(req.user.username, mergedJSON, daysUntil);
    let jsonResult = {flightID : flightIndex, htmlString : htmlString};
    res.send(JSON.stringify(jsonResult));

})
app.delete('/delete', async function (req, res) {
    try {

        const flight = await flightCollection.findOne({
            username: req.user.username,
            flightID: req.body.flightIndex
        });
        if (!flight) {
            console.log("Could not delete flight");
            return res.status(404).send('Flight not found');
        }

        const deleteRequest = await flightCollection.deleteOne({
            username: req.user.username,
            flightID: req.body.flightIndex
        });
        console.log(deleteRequest.deletedCount)
        // Check if a document was actually deleted

        if (deleteRequest.deletedCount > 0) {
            res.send("Delete successful");
        } else {
            res.status(404).send('Not Found');
        }
    } catch (err) {
        console.error("Error deleting:", err);
        res.status(500).send('Server error');
    }
})

app.post('/logout', function (req, res) {
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error logging out.');
        }
        res.status(200).send('Logout successful');
    });
})

app.get('/getAllFlights', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User not authenticated');
    }
    let htmlEntries = {}
    try {
        const flights = await flightCollection.find({ username: req.user.username }).toArray();
        if(count === 0) {
            count += flights.length
        }
        flights.forEach((flight, index) => {
            const htmlString = contentHelper.createTableRow(flight, flight.daysTil, flight.flightID);
            htmlEntries[index] = {
                htmlString: htmlString,
                flightID: flight.flightID
            };
        })
        res.json(htmlEntries);
    } catch (err) {
        res.status(500).send('Error retrieving flights');
    }
});

/*
Get specific flight to modify
 */
app.get(`/getFlightDetails/:flightID`, async function (req, res) {
    try{
        if (!req.isAuthenticated()) {
            return res.status(401).send('User not authenticated');
        }
        const flight = await flightCollection.findOne({
            username: req.user.username,
            flightID: Number(req.params.flightID)
        });
        console.log(flight)
        if(!flight) {
            res.status(404).send('Flight not found');
        } else {
            res.json(flight);
        }
    } catch (err){
        res.status(500).send('Error retrieving flight');
    }
})
/*
handle post and submit modification to database & create fn in content helper to change html alr in page
 */
app.post(`/modifyFlightData/:flightID`, async function (req, res) {
    try{
        if (!req.isAuthenticated()) {
            return res.status(401).send('User not authenticated');
        }

        const { cityDepart, cityDest, departDate, returnDate } = req.body;
        const flightID = Number(req.params.flightID);
        console.log(req.user.username, flightID);
        const updatedFlight = await flightCollection.updateOne(
            { username: req.user.username, flightID: flightID },
            { $set: { cityDepart, cityDest, departDate, returnDate } }
        );
        console.log(updatedFlight)

        if (updatedFlight.modifiedCount === 0) {
            return res.status(404).send("Flight not found or no changes made");
        }
        res.status(200).send(updatedFlight);
    } catch (err){
        res.status(500).send('Error updating flight');
    }
})



app.listen(process.env.PORT || 3000);
