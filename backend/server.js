const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());

// ★ 画像ディレクトリ（ここ重要）
const IMAGE_DIR = path.join(__dirname, "public/images");

/**
 * 画像ファイル一覧取得
 * ※毎回読む（シンプル設計）
 */
function getFiles() {
  const files = fs.readdirSync(IMAGE_DIR);

  // pngのみ対象（安全）
  return files.filter((f) => f.endsWith(".png"));
}

/**
 * ファイル名からキャラ名抽出
 * 例：
 * ディーふらぐ！_高尾部長.png → 高尾部長
 */
function getCharacter(filename) {
  return filename
    .replace(".png", "")
    .split("_")
    .slice(1)
    .join("_")
    .toLowerCase();
}

/**
 * 画像検索API
 * /image/:query
 */
app.get("/image/:query", (req, res) => {
  const files = getFiles();

  // ★ 入力正規化（超重要）
  const raw = req.params.query;
  const query = raw.trim().toLowerCase();

  // =========================
  // ① 数字検索（1-based index）
  // =========================
  const num = Number(query);

  if (!isNaN(num) && Number.isInteger(num)) {
    const index = num - 1;
    const file = files[index];

    return res.json({
      image: file ? `/images/${file}` : null,
    });
  }

  // =========================
  // ② キャラ名検索（部分一致）
  // =========================
  const found = files.find((file) => {
    const charName = getCharacter(file);
    return charName.includes(query);
  });

  if (found) {
    return res.json({
      image: `/images/${found}`,
    });
  }

  // =========================
  // ③ 見つからない
  // =========================
  return res.json({
    image: null,
  });
});

/**
 * サーバ起動
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
});