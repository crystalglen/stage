// Utility to compress images.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tiff']);

/**
 * Recursively scans a directory and returns full paths for all image files.
 * @param {string} dirPath - Relative or absolute path to the starting folder.
 * @returns {Array<string>} Array of absolute image file paths.
 */
function loadImagesRecursive(dirPath) {
    const absolutePath = path.resolve(dirPath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`Folder not found: ${absolutePath}`);
        return [];
    }

    let results = [];

    // Read directory entries as Dirent objects to directly distinguish files from folders
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(absolutePath, entry.name);

        if (entry.isDirectory()) {
            // Recursively search subfolder
            results = results.concat(loadImagesRecursive(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.has(ext)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

// Load all images inside the media folder.
const images = loadImagesRecursive('../main');

images.forEach( async (imagePath) => {
  const imageName = path.basename(imagePath);
  // Compress the image using sharp.
  const compressedFolderPath = './public/images';
  const compressedImagePath = `${compressedFolderPath}/${imageName}`;
  await sharp(imagePath)
    .resize({ width: 800 }) // Resize to a max width of 800px
    .jpeg({ quality: 80 }) // Compress to 80% quality
    .toFile(compressedImagePath);
  console.log(`Compressed ${imageName}`);
});