const express = require("express");
const cors = require("cors");

const imageMap = require("./imageMap.json");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

app.get("/image/:num", (req, res) => {
  const num = parseInt(req.params.num, 10);

  if (isNaN(num) || num < 1) {
    return res.json({ image: null });
  }

  const index = num - 1;
  const item = imageMap.images[index];

  if (!item) {
    return res.json({ image: null });
  }

  res.json({
    image: item.path,
    id: item.id
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});