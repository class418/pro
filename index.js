const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// プロキシ用エンドポイント
app.post("/proxy", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URLがありません" });
  }

  try {
    // 外部サイトのHTMLを取得
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: "外部サイトの取得に失敗しました" });
    }
    const body = await response.text();

    // そのまま返す（Content-Typeは元のページのものをそのまま使うと良い）
    res.set("Content-Type", response.headers.get("content-type") || "text/html");
    res.send(body);
  } catch (e) {
    res.status(500).json({ error: "取得中にエラーが発生しました" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
