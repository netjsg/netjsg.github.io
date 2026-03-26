import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API to list all blog posts
  app.get("/api/posts", (req, res) => {
    const postsDir = path.join(staticPath, "posts");
    if (!fs.existsSync(postsDir)) {
      return res.json([]);
    }

    try {
      const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
      res.json(files);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
