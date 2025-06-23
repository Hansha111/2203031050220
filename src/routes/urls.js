const express = require('express');
const urls = require('../data/urls');
const generateShortCode = require('../utils/generateShortCode');

const router = express.Router();

//post
router.post('/', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' parameter" });
  }

  const code = shortcode || generateShortCode();
  if (urls[code]) {
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const expiresAt = new Date(Date.now() + validity * 60 * 1000);
  urls[code] = {
    longUrl: url,
    createdAt: new Date(),
    expiresAt,
    clickData: []
  };
  res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry: urls[code].expiresAt
  });
});

//get
router.get('/:code', (req, res) => {
  const entry = urls[req.params.code];
  if (!entry) {
    return res.status(404).json({ error: "Short link not found" });
  }
  if (new Date() > entry.expiresAt) {
    return res.status(410).json({ error: "Link has expired" });
  }
  entry.clickData.push({
    timestamp: new Date(),
    referrer: req.get('Referrer'),
    ip: req.ip
  });
  res.redirect(entry.longUrl);
});

//get ==> /stats
router.get('/:code/stats', (req, res) => {
  const entry = urls[req.params.code];
  if (!entry) {
    return res.status(404).json({ error: "Short link not found" });
  }
  res.json({
    url: entry.longUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiresAt,
    totalClicks: entry.clickData.length,
    clickDetails: entry.clickData
  });
});
module.exports = router;


