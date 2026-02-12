const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Route pour lister les images disponibles
router.get("/images", (req, res) => {
  try {
    // ✅ CORRECTION : chemin vers public/images à la racine
    const imagesDir = path.join(__dirname, "../../public/images");

    console.log("📁 Chemin images:", imagesDir); // Debug

    if (!fs.existsSync(imagesDir)) {
      console.log("❌ Dossier n'existe pas!");
      return res.json([]);
    }

    const files = fs.readdirSync(imagesDir);
    const images = files.filter((file) =>
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i),
    );

    console.log("✅ Images trouvées:", images);
    res.json(images);
  } catch (error) {
    console.error("Erreur:", error);
    res.json([]);
  }
});

// Route pour sauvegarder les coordonnées
router.post("/save-coordinates", (req, res) => {
  try {
    const { imageName, characterName, x, y } = req.body;

    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dataPath = path.join(dataDir, "coordinates.json");

    let coordinates = {};
    if (fs.existsSync(dataPath)) {
      coordinates = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }

    if (!coordinates[imageName]) {
      coordinates[imageName] = [];
    }

    coordinates[imageName].push({
      characterName,
      x,
      y,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(dataPath, JSON.stringify(coordinates, null, 2));

    res.json({ success: true, message: "Coordonnées sauvegardées" });
  } catch (error) {
    console.error("Erreur sauvegarde:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
