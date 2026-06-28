import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('../../video to jpg');
const outputDir = path.resolve('./public/hero-frames');

console.log(`Input Directory: ${inputDir}`);
console.log(`Output Directory: ${outputDir}`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));
  console.log(`Found ${files.length} JPG files to convert.`);

  if (files.length === 0) {
    console.error("No JPG files found. Please make sure the input directory is correct.");
    process.exit(1);
  }

  // Convert each file
  let completed = 0;
  
  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));

    sharp(inputPath)
      .webp({ quality: 90, effort: 6 }) // visually lossless quality, effort 6 is high compression
      .toFile(outputPath)
      .then(() => {
        completed++;
        console.log(`[${completed}/${files.length}] Converted ${file} -> ${path.basename(outputPath)}`);
        if (completed === files.length) {
          console.log("\nAll assets converted successfully!");
        }
      })
      .catch(err => {
        console.error(`Error converting ${file}:`, err);
      });
  });
} catch (error) {
  console.error("Failed to read input directory:", error);
}
