const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Define the path to your "Public" folder
const CONTENT_DIR = path.join(__dirname, "..", "public", "content");

// --- API ENDPOINT: Save an Article ---
app.post("/api/save-article", (req, res) => {
  const articleData = req.body;

  if (!articleData.id) {
    return res.status(400).json({ error: "Article ID is missing" });
  }

  // 1. Define the file path (e.g., public/content/articles/8.json)
  const filePath = path.join(CONTENT_DIR, "articles", `${articleData.id}.json`);

  // 2. Write the file
  fs.writeFile(filePath, JSON.stringify(articleData, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }
    console.log(`Saved article ${articleData.id} to ${filePath}`);
    res.json({ success: true, message: "Article saved successfully!" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
