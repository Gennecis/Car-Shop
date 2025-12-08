const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const app = express();

module.exports = app; // Export app for testing
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use("/", require("./routes"));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`database is listening and node Running on port ${port}`);
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});