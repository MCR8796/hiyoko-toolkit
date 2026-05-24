const express = require("express");
const cors = require("cors");

const imageMap = require("./imageMap.json");

const app = express();

app.use(cors());

app.get("/image/:num", (req, res) => {

    const num = req.params.num;

    res.json({
        image: imageMap[num] || null
    });

});

app.listen(3001, () => {
    console.log("server start");
});