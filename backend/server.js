const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// 画像ディレクトリ
const IMAGE_DIR = path.join(__dirname, "image");

// 静的配信（直接アクセス用）
app.use("/images", express.static(IMAGE_DIR));

let imageList = [];

/**
 * 画像読み込み（ファイル名は関係なく順番で管理）
 */
function loadImages() {
  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
    .sort((a, b) => {
      // ファイル名順（日本語OK）
      return a.localeCompare(b, "ja");
    });

  imageList = files.map((file, index) => ({
    id: index + 1,
    file,
    path: `/images/${file}`,
  }));

  console.log("loaded images:", imageList);
}

// 初回ロード
loadImages();

/**
 * ヘルスチェック
 */
app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

/**
 * GET /image/:num
 * 1からの連番で取得
 */
app.get("/image/:num", (req, res) => {
  const num = parseInt(req.params.num, 10);

  if (isNaN(num) || num < 1) {
    return res.status(400).json({ error: "invalid number" });
  }

  const item = imageList[num - 1];

  if (!item) {
    return res.status(404).json({ error: "image not found" });
  }

  return res.json({
    id: item.id,
    image: item.path,
    fileName: item.file,
  });
});

/**
 * 再読み込み（画像追加したとき用）
 */
app.get("/reload-images", (req, res) => {
  loadImages();
  res.json({
    message: "reloaded",
    count: imageList.length,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});