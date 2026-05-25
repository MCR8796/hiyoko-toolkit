const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

const imageDir = path.join(__dirname, "image");

/*
 imageフォルダ公開
 URL:
 /image/ファイル名
*/
app.use(
  "/image",
  express.static(imageDir)
);

/*
 imageフォルダ内の画像一覧取得
 起動時1回のみ
*/
const imageFiles = fs
  .readdirSync(imageDir)
  .filter((file) =>
    /\.(png|jpg|jpeg|gif|webp)$/i.test(file)
  )
  .sort((a, b) =>
    a.localeCompare(b, "ja")
  );

console.log("画像数:", imageFiles.length);

app.get("/", (req, res) => {
  res.send("Hiyoko API Running");
});

app.get("/image/:num", (req, res) => {
  const num = parseInt(req.params.num, 10);

  if (isNaN(num) || num < 1) {
    return res.json({
      image: null
    });
  }

  const fileName = imageFiles[num - 1];

  if (!fileName) {
    return res.json({
      image: null
    });
  }

  res.json({
    id: num,
    image: `/image/${encodeURIComponent(fileName)}`
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server start: ${PORT}`);
});