const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const imageMap = require("./imageMap.json");

const app = express();

app.use(cors());

const imageDir = path.join(__dirname, "image");

console.log("imageDir =", imageDir);

if (fs.existsSync(imageDir)) {
  console.log("files =", fs.readdirSync(imageDir));
} else {
  console.log("image folder NOT FOUND");
}

app.use("/images", express.static(imageDir));

app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

app.get("/image/:num", (req, res) => {
  const num = parseInt(req.params.num, 10);

  if (isNaN(num) || num < 1) {
    return res.json({ image: null });
  }

  const fileName = imageMap[num - 1];

  if (!fileName) {
    return res.json({ image: null });
  }

  res.json({
    id: num,
    image: `/images/${encodeURIComponent(fileName)}`
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});