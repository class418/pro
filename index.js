app.post("/proxy", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URLがありません" });
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return res.status(400).json({ error: "無効なURLです" });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RenderProxy/1.0)" },
    });
    if (!response.ok) {
      return res.status(500).json({ error: `外部サイトの取得に失敗しました: ${response.status}` });
    }
    const body = await response.text();
    res.set("Content-Type", response.headers.get("content-type") || "text/html");
    res.send(body);
  } catch (e) {
    console.error("Fetch error:", e);
    res.status(500).json({ error: "取得中にエラーが発生しました" });
  }
});
