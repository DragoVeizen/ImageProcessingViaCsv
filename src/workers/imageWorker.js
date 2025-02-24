// Image Processing Worker
const Queue = require('bull');
const { processImage } = require('../services/imageProcessor');
const db = require('../models');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const imageQueue = new Queue('image-processing');

imageQueue.process(async (job, done) => {
    try {
        console.log(`Processing images for Product ID: ${job.data.productId}`);
        const images = await db.Image.findAll({
            where: { product_id: job.data.productId, output_url: null }
        });

        for (const image of images) {
            console.log(`Processing image: ${image.input_url}`);
            const outputPath = await processImage(image.input_url, job.data.productId);
            await db.Image.update(
                { output_url: outputPath },
                { where: { id: image.id } }
            );
        }

        const remainingImages = await db.Image.count({
            where: { request_id: job.data.requestId, output_url: null }
        });

        if (remainingImages === 0) {
            await db.Request.update(
                { status: 'completed' },
                { where: { id: job.data.requestId } }
            );
            console.log(`Request ${job.data.requestId} marked as completed.`);
            generateCSV(job.data.requestId);

            // Call the webhook with request status
            await axios.post(process.env.URL_PATH + "/webhook", { requestId: job.data.requestId });
        }
        done();
    } catch (error) {
        console.error('Error processing images:', error);
        done(error);
    }
});

console.log('Image processing worker started...');

// Function to generate CSV
const generateCSV = async (requestId) => {
    try {
        const request = await db.Request.findByPk(requestId, {
            include: [{ model: db.Product, include: [db.Image] }]
        });

        if (!request) {
            console.error(`Request ${requestId} not found.`);
            return;
        }

        const csvPath = path.join(__dirname, `../uploads/output-${requestId}.csv`);
        const stream = fs.createWriteStream(csvPath);
        stream.write('Serial Number,Product Name,Input URLs,Output URLs\n');

        let serialNumber = 1;
        for (const product of request.Products) {
            for (const image of product.Images) {
                stream.write(`${serialNumber},${product.name},${image.input_url},${image.output_url}\n`);
                serialNumber++;
            }
        }

        stream.end();
        console.log(`CSV generated at: ${csvPath}`);
    } catch (error) {
        console.error(`Error generating CSV for request ${requestId}:`, error);
    }
};
