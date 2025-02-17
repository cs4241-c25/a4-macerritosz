import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist', '/index.html'));
});

app.post('/submit', async function (req, res) {
    /*
    submit data into the flight collection: since there can be repeats, validation not necessary, modify body str to add data modification
     */
    let count = 0;
    let daysTil = 0;


    console.log("Got post")
    console.log(req.body);
    const mergeJson = {...{id :count}, ...req.body, ...{daysUntil: daysTil}};
    console.log(mergeJson);
    /*
    Flight Data will have associated user added with it, and an ID which will also be passed to button look into ES6 reading for the user thing
     */

    res.send(JSON.stringify(mergeJson));

})

app.listen(process.env.PORT || 3000);