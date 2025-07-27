const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
app.use(cors());

// Endpoint to get medicines data
app.get("/medicines", (req, res) => {
  const results = [];

  fs.createReadStream(path.join(__dirname, "medicines.csv"))
    .pipe(csv())
    .on("data", (data) => {
      // Parse sideEffects string into array by splitting on ';'
      const sideEffectsArray = data.sideEffects
        ? data.sideEffects.split(";").map((s) => s.trim())
        : [];

      results.push({
        brand: data.brand,
        generic: data.generic,
        brandPrice: data.brandPrice,
        genericPrice: data.genericPrice,
        brandImage: data.brandImage,
        genericImage: data.genericImage,
        sideEffects: sideEffectsArray,
      });
    })
    .on("end", () => {
      res.json({ medicines: results });
    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Failed to parse CSV" });
    });
});

// Serve static images from a 'public' folder if you want
app.use("/pages", express.static(path.join(__dirname, "public", "pages")));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
