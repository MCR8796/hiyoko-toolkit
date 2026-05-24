const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

const IMAGE_DIR = path.join(__dirname, "public/images");

// ★重要：画像公開
app.use("/images", express.static(IMAGE_DIR));

function getFiles() {
  return fs.readdirSync(IMAGE_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "ja"));
}

// キャラ名抽出
function getCharacter(file) {
  return file
    .replace(/\.[^/.]+$/, "")
    .split("_")
    .slice(1)
    .join("_")
    .toLowerCase();
}

// API
app.get("/image/:query", (req, res) => {
  const files = getFiles();

  const q = req.params.query.trim().toLowerCase();

  // 数字検索
  const num = Number(q);

  if (Number.isInteger(num)) {
    const file = files[num - 1];

    return res.json({
      image: file ? `/images/${encodeURIComponent(file)}` : null,
    });
  }

  // キャラ名検索
  const found = files.find(f =>
    getCharacter(f).includes(q)
  );

  return res.json({
    image: found ? `/images/${encodeURIComponent(found)}` : null,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
});