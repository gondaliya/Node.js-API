const express = require("express");
const basic_api = express();
const bodyParser = require("body-parser");

const port = 3000;

basic_api.use(bodyParser.urlencoded({ extended: false }));
basic_api.use(bodyParser.json());

const users = require("./users.js");

basic_api.use("/api/", users)

basic_api.listen(port, () => {
    console.log(`API Service is running @localhost${port}`);
})


