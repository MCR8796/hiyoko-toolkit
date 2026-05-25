const express = require("express");
const cors = require("cors");
const path = require("path");

const imageList = require("./imageMap.json");

const app = express();

app.use(cors());

// 画像配信
app.use("/images", express.static(path.join(__dirname, "image")));

app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

app.get("/image/:num", (req, res) => {
  const num = parseInt(req.params.num, 10);

  if (isNaN(num) || num < 1) {
    return res.status(400).json({ image: null });
  }

  const fileName = imageList[num - 1];

  if (!fileName) {
    return res.status(404).json({ image: null });
  }

  res.json({
    id: num,
    image: `/images/${fileName}`,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});