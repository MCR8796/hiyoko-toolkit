const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

const app = express();

// セキュリティ・圧縮
app.use(helmet());
app.use(compression());

// CORS（本番対応）
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// 画像ディレクトリ（backend/image）
const IMAGE_DIR = path.join(__dirname, "image");

// 静的配信（重要）
app.use("/images", express.static(IMAGE_DIR));

// 画像キャッシュリスト
let imageList = [];

/**
 * 画像を読み込み直してキャッシュ化
 */
function loadImages() {
  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
    .sort((a, b) => {
      const aNum = parseInt(a.split(".")[0], 10);
      const bNum = parseInt(b.split(".")[0], 10);
      return aNum - bNum;
    });

  imageList = files.map((file, index) => ({
    id: index + 1,
    file,
    path: `/images/${file}`,
  }));
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
 * 1からの連番取得
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
  });
});

/**
 * 画像リロード（運用用）
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