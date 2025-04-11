import { Jimp } from "jimp";
import { intToRGBA } from "jimp";
import fs from "fs";
import path from "path";

// Update to your target directory containing PNG files
const directoryPath = "./convertSprites";

async function processImage(filePath) {
  const image = await Jimp.read(filePath);

  // Get the color of the top-left pixel
  const { r, g, b, a } = intToRGBA(image.getPixelColor(0, 0));

  // Replace matching color with transparency
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const currentR = image.bitmap.data[idx + 0];
    const currentG = image.bitmap.data[idx + 1];
    const currentB = image.bitmap.data[idx + 2];
    const currentA = image.bitmap.data[idx + 3];

    // If the pixel matches the background color, make it transparent
    if (currentR === r && currentG === g && currentB === b && currentA === a) {
      image.bitmap.data[idx + 3] = 0; // Set alpha to 0
    }
  });

  // Convert image to Base64
  const base64Str = await image.getBase64("image/png");

  // For demonstration, just log the output length
  console.log(`File: ${filePath} => Base64 length: ${base64Str.length}`);
  return base64Str;
  // You could also write the base64 string to a file or database here
  // e.g.: fs.writeFileSync(`${filePath}.b64.txt`, base64Str);
}

fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    return console.error("Error reading directory:", err);
  }

  // Filter out PNG files
  const pngFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".png"
  );

  // Process each PNG
  let obj = {};
  for (const file of pngFiles) {
    const filePath = path.join(directoryPath, file);
    try {
      let n = file.split(".")[0];
      let base64 = await processImage(filePath);
      obj[n] = base64;
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }
  console.log(obj);
});
