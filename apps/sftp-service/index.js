require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { listDirectory, streamFile, uploadFile } = require("./sftp");

const app = express();
const PORT = process.env.PORT || 4001;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// 🗂️ List files
app.post("/list", async (req, res) => {
  const { host, port, username, password, privateKey, path } = req.body;

  try {
    const files = await listDirectory({ host, port, username, password, privateKey }, path);
    res.json({ files });
  } catch (error) {
    console.error("List Error:", error);
    res.status(500).json({ error: "Failed to list directory" });
  }
});

// 📥 Download/Preview file
app.get("/download", async (req, res) => {
  const { host, port, username, password, privateKey, file } = req.query;

  try {
    await streamFile({ host, port, username, password, privateKey }, file, res);
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).send("Failed to stream file");
  }
});

// 🔼 Upload file
app.post("/upload", upload.single("file"), async (req, res) => {
  const { host, port, username, password, privateKey, path } = req.body;
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded");

  const remotePath = `${path}/${file.originalname}`;

  try {
    await uploadFile({ host, port, username, password, privateKey }, remotePath, file.buffer);
    res.send("File uploaded successfully");
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("Failed to upload file");
  }
});

app.listen(PORT, () => {
  console.log(`🟢 SFTP microservice listening on port ${PORT}`);
});
