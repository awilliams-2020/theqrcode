const fs = require('fs');

// Create a proper ICO file with a simple QR code pattern
// This creates a valid ICO file with 16x16 and 32x32 versions

// ICO file structure
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type (1 = ICO)
  0x02, 0x00, // Number of images (2: 16x16 and 32x32)
]);

// Directory entry for 16x16
const dirEntry16 = Buffer.from([
  0x10, 0x00, // Width (16)
  0x10, 0x00, // Height (16)
  0x00, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x00, 0x00, 0x00, // Size of image data (will be filled)
  0x16, 0x00, 0x00, 0x00, // Offset to image data
]);

// Directory entry for 32x32
const dirEntry32 = Buffer.from([
  0x20, 0x00, // Width (32)
  0x20, 0x00, // Height (32)
  0x00, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x00, 0x00, 0x00, // Size of image data (will be filled)
  0x00, 0x00, 0x00, 0x00, // Offset to image data (will be filled)
]);

// Create a simple QR code pattern as PNG data
function createQRPattern(size) {
  const pixels = [];
  
  // Create a simple QR code pattern
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Create a checkerboard pattern with QR-like structure
      const isBlack = (x + y) % 3 === 0 || (x % 4 === 0 && y % 4 === 0);
      
      if (isBlack) {
        // Black pixel (RGBA: 0, 0, 0, 255)
        pixels.push(0, 0, 0, 255);
      } else {
        // White pixel (RGBA: 255, 255, 255, 255)
        pixels.push(255, 255, 255, 255);
      }
    }
  }
  
  return Buffer.from(pixels);
}

// Create 16x16 image data
const image16 = createQRPattern(16);
const image32 = createQRPattern(32);

// Calculate sizes and offsets
const size16 = image16.length;
const size32 = image32.length;
const offset16 = 6 + 16 + 16; // header + 2 dir entries
const offset32 = offset16 + size16;

// Update directory entries with correct sizes and offsets
dirEntry16.writeUInt32LE(size16, 8);
dirEntry32.writeUInt32LE(size32, 8);
dirEntry32.writeUInt32LE(offset32, 12);

// Combine all parts
const icoData = Buffer.concat([
  icoHeader,
  dirEntry16,
  dirEntry32,
  image16,
  image32
]);

// Write the ICO file
fs.writeFileSync('/home/awilliams/qr-analytics-saas/src/app/favicon.ico', icoData);
console.log('Proper favicon.ico created successfully!');
console.log('File size:', icoData.length, 'bytes');
