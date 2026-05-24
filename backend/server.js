const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * ★ 画像ディレクトリ（ここが超重要）
 * backend/public/images に画像を置く想定
 */
const IMAGE_DIR = path.join(__dirname, "public/images");

/**
 * ★ 静的配信（これがないと Cannot GET になる）
 */
app.use(
  "/images",
  express.static(IMAGE_DIR)
);

/**
 * 画像ファイル一覧取得
 */
function getFiles() {
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error("IMAGE_DIR not found:", IMAGE_DIR);
    return [];
  }

  return fs.readdirSync(IMAGE_DIR).filter((f) => {
    return f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg");
  });
}

/**
 * キャラ名抽出
 * 例: ディーふらぐ！_高尾部長.png → 高尾部長
 */
function getCharacter(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .split("_")
    .slice(1)
    .join("_")
    .toLowerCase();
}

/**
 * 画像検索API
 */
app.get("/image/:query", (req, res) => {
  const files = getFiles();

  if (files.length === 0) {
    return res.json({ image: null, error: "no images found" });
  }

  const raw = req.params.query;
  const query = raw.trim().toLowerCase();

  // =========================
  // ① 数字検索（1〜）
  // =========================
  const num = Number(query);

  if (!isNaN(num) && Number.isInteger(num)) {
    const index = num - 1;
    const file = files[index];

    return res.json({
      image: file ? `/images/${encodeURIComponent(file)}` : null,
    });
  }

  // =========================
  // ② キャラ名検索
  // =========================
  const found = files.find((file) => {
    return getCharacter(file).includes(query);
  });

  if (found) {
    return res.json({
      image: `/images/${encodeURIComponent(found)}`,
    });
  }

  // =========================
  // ③ 未ヒット
  // =========================
  return res.json({
    image: null,
  });
});

/**
 * ヘルスチェック
 */
app.get("/", (req, res) => {
  res.send("HIYOKO API is running");
});

/**
 * 起動
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
  console.log("image dir:", IMAGE_DIR);
});