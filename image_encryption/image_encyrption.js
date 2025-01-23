//data type for the image
const { createCanvas, loadImage } = require('canvas');



// Only create these if they don't exist
const imageData = {
    originalPath: "image_encryption/assets/allec-gomes-UcWUMqIsld8-unsplash.jpg",
    pixelData: null,
    width: 0,
    height: 0,
    encryptionKey: "your-secret-key"
 };

if (typeof loadImage === 'undefined') {
    function loadImage(imagePath) {
        const img = new Image();
        const canvas = document.getElementById('imageCanvas');
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            imageData.width = img.width;
            imageData.height = img.height;
            imageData.pixelData = ctx.getImageData(0, 0, img.width, img.height);
        };
        
        img.src = imagePath;
    }
}

loadImage(imageData.originalPath);
