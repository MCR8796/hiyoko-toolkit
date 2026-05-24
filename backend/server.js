const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

// ★これを追加（画像配信）
app.use("/images", express.static(path.join(__dirname, "public/images")));

const MAP_PATH = path.join(__dirname, "imageMap.json");

function loadMap() {
  return JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
}

app.get("/image/:query", (req, res) => {
  const map = loadMap();
  const query = req.params.query.trim();

  if (!isNaN(query)) {
    return res.json({
      image: map[query] || null,
    });
  }

  return res.json({ image: null });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
});