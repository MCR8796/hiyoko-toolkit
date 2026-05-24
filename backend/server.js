const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const imageMap = {
  1: "https://picsum.photos/id/237/500/300",
  2: "https://picsum.photos/id/40/500/300",
  3: "https://picsum.photos/id/1074/500/300"
};

app.get("/image/:num", (req, res) => {
  const num = req.params.num;

  res.json({
    image:
      imageMap[num] ||
      "https://placehold.co/500x300?text=No+Image"
  });
});

app.listen(3001, () => {
  console.log("server start");
});