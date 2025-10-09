const express = require('express');
const multer = require('multer');
const addon = require('./build/Release/imageAddon');

const app = express();
const upload = multer();

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

app.post('/convert', upload.single('image'), (req, res) => {
  try {
    const result = addon.imageToNumbers(req.file.buffer);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/generate', express.json(), (req, res) => {
  try {
    const { numbers, width, height } = req.body;
    const buffer = addon.numbersToImage(numbers, width, height);
    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));