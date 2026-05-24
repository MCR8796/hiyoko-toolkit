const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

const IMAGE_DIR = path.join(__dirname, "public/images");

// ファイル一覧取得
function getFiles() {
  return fs.readdirSync(IMAGE_DIR);
}

// キャラ名抽出
function getCharacter(filename) {
  return filename
    .replace(".png", "")
    .split("_")
    .slice(1)
    .join("_")
    .toLowerCase();
}

// 画像取得API
app.get("/image/:query", (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const files = getFiles();

  // ① 数字検索（インデックス扱い）
  if (!isNaN(query)) {
    const index = Number(query) - 1;
    const file = files[index];

    return res.json({
      image: file ? `/images/${file}` : null,
    });
  }

  // ② キャラ名検索（部分一致）
  const found = files.find((f) =>
    getCharacter(f).includes(query)
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