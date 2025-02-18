import express from "express";
import path, {dirname} from "path";
import {fileURLToPath} from 'url';
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import {Strategy as GitHubStrategy} from "passport-github2";
import LocalStrategy from "passport-local";


dotenv.config();

const {
    MONGO_USER,
    MONGO_PASS,
    MONGO_HOST,
    MONGO_DBNAME,
    MONGO_DBCOLLECTION,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET
} = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/`;
const client = new MongoClient(url);
let flightCollection = null;
let loginCollection = null;
let count = 0;

app.use(session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));


async function connect() {
    await client.connect().then(() => {console.log("Connected!")});
    flightCollection = await client.db(MONGO_DBNAME).collection(MONGO_DBCOLLECTION);
    let db = client.db(MONGO_DBNAME);

    const checkExists = await db.listCollections({name:'loginData'}).toArray()
    if(checkExists.length === 0){
        await db.createCollection("loginData", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Login Object Validation",
                    required: ["username", "password"],
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
        })
        console.log("Successfully Creates user collection w/ schema validation")
    }
    loginCollection= db.collection("loginData");
}
connect().then(() => {
    //when new user is connected, reset count for that user
    count = 0;
});



app.use(passport.authenticate('session'));
/*
    Strategy Section
 */
//Local Strategy to allow for normal Login
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await loginCollection.findOne({username: username})
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
//Github strategy to allow for auth through account
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

// Serializing user into session
passport.serializeUser(function(user, done) {
    process.nextTick(function() {
        return done(null, {
            id: user.id,
            username: user.username
        });
    });
});

passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
        return done(null, user);
    });
});

/* Login, SignUp, Logout */

//login local strategy
app.post('/login', function (req,res,next) {
    passport.authenticate('local', function (error, user) {
        if (error) {
            console.error('Authentication error:', error);
            return next(error);
        }
        if (!user) {
            console.log('Login failed: Incorrect username or password');
            return res.status(401).json({error: 'Incorrect username or password.'});
        }

        req.login(user,function(err) {
            if (err) {
                console.error('Session error:', err)
                return next(err);
            }
            return res.status(200).json({success: "Login successful"});
        });

    })(req,res,next)
});
//login github Strategy
app.get('/auth/github/callback',
    passport.authenticate('github', { session: true, failureRedirect: '/Login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

//Normal Signup path -> check user against db [y] -> redir to home, [n} -> send error
app.post('/Signup', async function (req, res) {
    /*
    Create user sign up data by inserting into database, use .findOne to check if username has not been used before
     */
    const loginExists = await loginCollection.findOne({
        username: req.body.username
    })
    if(loginExists) {
        console.log("Could not create signup");
        return res.status(400).send("User already exists");
    } else {
        const results = await loginCollection.insertOne(req.body);
        console.log(results);
        res.send("Signup Successful");
    }
})
// Handles ALL logout Req
app.post('/logout', function (req, res) {
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error logging out.');
        }
        res.status(200).send('Logout successful');
    });
})

//allow client side to get the username
app.get('/profile', (req, res) => {
    if(req.isAuthenticated()){
        res.json({username:req.user.username});
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

/* Submit, Delete, Modify */
app.post('/submit', async function (req, res) {
    /*
    submit data into the flight collection: since there can be repeats, validation not necessary, modify body str to add data modification
     */
    req.body.daysTil = checkDaysTil(req.body);

    //When passed in from submit, body is appended to a username and ID, whcih is kept track of by a user, ID will not be used twice for  user, even if deleted
    const mergedJSON = {...{username:req.user.username}, ...{flightID : count},...req.body}
    count++;

    await flightCollection.insertOne(mergedJSON, (err) => {
        if(err){
            res.send('Error');
        } else  {
            res.send('success');
        }
    })
    // Send back the modified data to be passed into the table component
    res.send(JSON.stringify(mergedJSON));

})

app.delete('/delete', async function (req, res) {
    try {
        const flight = await flightCollection.findOne({
            username: req.user.username,
            flightID: req.body.flightIndex
        });
        if (!flight) {
            console.log("Could not find flight");
            return res.status(404).send('Flight not found');
        }

        const deleteRequest = await flightCollection.deleteOne({
            username: req.user.username,
            flightID: req.body.flightIndex
        });

        // Check if a document was actually deleted
        if (deleteRequest.deletedCount > 0) {
            res.json({result:"success"});
        } else {
            console.log("Could not delete flight");
            res.status(404).json({result: 'Not Found'});
        }
    } catch (err) {
        console.error("Error deleting:", err);
        res.status(500).send('Server error');
    }
})

app.post(`/modifyFlightData/:flightID`, async function (req, res) {
    try{
        if (!req.isAuthenticated()) {
            return res.status(401).send('User not authenticated');
        }

        //if departDate changed so will daysTil
        req.body.daysTil = checkDaysTil(req.body);

        const { cityDepart, cityDest, departDate, returnDate, daysTil } = req.body;
        const flightID = Number(req.params.flightID);

        const updatedFlight = await flightCollection.updateOne(
            { username: req.user.username, flightID: flightID },
            { $set: { cityDepart, cityDest, departDate, returnDate, daysTil } }
        );


        if (updatedFlight.modifiedCount === 0) {
            return res.status(404).send("Flight not found or no changes made");
        } else {
            const findUpdated = await flightCollection.findOne({
                username: req.user.username,
                flightID: flightID
            });
            if(!findUpdated){
                return res.status(404).send("Flight not found after update");
            } else {
                res.json(findUpdated)
            }
        }


    } catch (err){
        console.log('Error updating flight', err)
        res.status(500).send('Error updating flight');
    }
})

app.get('/getAllFlights', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User not authenticated');
    }
    try {
        const flights = await flightCollection.find({ username: req.user.username }).toArray();
        if(count === 0) {
            count += flights.length
        }
        //send as array of objects as json
        res.json(flights);
    } catch (err) {
        console.log('Error retrieving flights', err)
        res.status(500).send('Error retrieving flights');
    }
});

/* Helper Functions */

const formatDate = (date) => {
    //get year/month/day for Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
};

function checkDaysTil(dataString) {
    //from string to something Date object can process, take out '-'
    const depart = dataString.departDate.replace(/-/g,'/');
    const departDate = new Date(depart);

    const currentDate = new Date();
    const today = new Date(formatDate(currentDate));

    //change from ms to days
    return Math.ceil((departDate - today) / (1000 * 60 * 60 * 24));
}

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', '/index.html'));
});

app.listen(process.env.PORT || 3000);