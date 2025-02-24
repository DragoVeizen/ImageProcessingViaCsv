const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const ensureDirectoryExists = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const downloadImage = async (url, outputPath) => {
    ensureDirectoryExists(outputPath);
    const writer = fs.createWriteStream(outputPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

exports.processImage = async (imageUrl, productId) => {
    try {
        const outputFilename = `compressed-${productId}.jpg`;
        const outputPath = path.join(__dirname, '../uploads', outputFilename);
        const tempPath = path.join(__dirname, '../uploads', `temp-${productId}.jpg`);

        console.log(`Downloading image from: ${imageUrl}`);

        // Ensure directory exists before downloading
        ensureDirectoryExists(tempPath);

        // Download the image before processing
        await downloadImage(imageUrl, tempPath);

        console.log(`Processing image: ${tempPath}`);

        // Use sharp to process the downloaded image
        await sharp(tempPath)
            .resize(500)
            .toFile(outputPath);

        // Delete the temporary file after processing
        fs.unlinkSync(tempPath);

        console.log(`Processed image saved at: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};
