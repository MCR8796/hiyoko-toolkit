const express = require("express");
const cors = require("cors");

const imageMap = require("./imageMap.json");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

app.get("/image/:num", (req, res) => {
  const num = req.params.num;

  res.json({
    image: imageMap[num] || null
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});