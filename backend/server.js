const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const REPO = "MCR8796/hiyoko-toolkit";
const TOKEN = process.env.GITHUB_TOKEN;

const MAP_PATH = path.join(__dirname, "imageMap.json");

// =========================
// 起動ログ（重要）
// =========================
console.log("server start:", process.env.PORT || 3001);
console.log("TOKEN exists:", !!process.env.GITHUB_TOKEN);
console.log(
  "TOKEN preview:",
  process.env.GITHUB_TOKEN
    ? process.env.GITHUB_TOKEN.slice(0, 6) + "..."
    : "NULL"
);

// =========================
// imageMap読み込み
// =========================
function loadMap() {
  return JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));
}

// =========================
// imageMap保存
// =========================
function saveMap(map) {
  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
}

// =========================
// GitHubアップロード
// =========================
async function uploadToGitHub(filename, base64) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/frontend/public/images/${filename}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `add image ${filename}`,
        content: base64,
      }),
    }
  );

  const data = await res.json();

  // ★ここが超重要（GitHub結果ログ）
  console.log("GitHub response:", data);

  return data;
}

// =========================
// upload API
// =========================
app.post("/upload", async (req, res) => {
  const { name, base64 } = req.body;

  console.log("upload request:", name);

  if (!name || !base64) {
    return res.status(400).json({ error: "invalid request" });
  }

  try {
    const filename = `${name}.png`;

    const result = await uploadToGitHub(filename, base64);

    const map = loadMap();
    map[name] = `/images/${filename}`;
    saveMap(map);

    console.log("upload success:", filename);

    res.json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ error: "upload failed" });
  }
});

// =========================
// image取得
// =========================
app.get("/image/:id", (req, res) => {
  const map = loadMap();

  res.json({
    image: map[req.params.id] || null,
  });
});

// =========================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("server start:", PORT);
});