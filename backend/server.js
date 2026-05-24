const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

const app = express();

// middleware
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// =========================
// 画像ディレクトリ
// =========================
const IMAGE_DIR = path.join(process.cwd(), "image");

// 静的配信（直接アクセス用）
app.use("/images", express.static(IMAGE_DIR));

// =========================
// 画像リストキャッシュ
// =========================
let imageList = [];

function loadImages() {
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error("IMAGE_DIR not found:", IMAGE_DIR);
    imageList = [];
    return;
  }

  const files = fs
    .readdirSync(IMAGE_DIR)
    .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, "ja"));

  imageList = files.map((file, index) => ({
    id: index + 1,
    file,
    path: `/images/${file}`,
  }));

  console.log("=== IMAGE LOAD ===");
  console.log("IMAGE_DIR:", IMAGE_DIR);
  console.log("FILES:", files);
  console.log("COUNT:", imageList.length);
}

// 初回ロード
loadImages();

// =========================
// API
// =========================
app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

// 1からの連番取得
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

// 画像再読み込み（運用用）
app.get("/reload-images", (req, res) => {
  loadImages();
  res.json({
    message: "reloaded",
    count: imageList.length,
  });
});

// =========================
// start
// =========================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server started on port", PORT);
});