const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

const IMAGE_DIR = path.join(__dirname, "public/images");

// 起動時に全ファイル取得
function getFiles() {
  return fs.readdirSync(IMAGE_DIR);
}

// キャラ名抽出（_以降）
function getCharacter(filename) {
  const name = filename.replace(".png", "");
  const parts = name.split("_");
  return parts.slice(1).join("_"); // キャラ名
}

app.get("/image/:query", (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const files = getFiles();

  // ① 完全一致ファイル名検索
  const direct = files.find((f) =>
    f.toLowerCase() === query + ".png"
  );

  if (direct) {
    return res.json({
      image: `/images/${direct}`,
    });
  }

  // ② キャラ名検索
  const found = files.find((f) =>
    getCharacter(f).toLowerCase().includes(query)
  );

  if (found) {
    return res.json({
      image: `/images/${found}`,
    });
  }

  // ③ 作品名は無視
  return res.json({ image: null });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
});