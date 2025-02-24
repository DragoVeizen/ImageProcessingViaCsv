const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../models'); 
const { queue } = require('../services/queue'); // Ensure correct path to queue
const { processCsv } = require('../services/csvProcessor'); // Ensure correct path
// const processCsv = (filePath, requestId) => {
//     return new Promise((resolve, reject) => {
//         const products = [];
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (row) => {
//                 products.push({ name: row['Product Name'], imageUrls: row['Input Image Urls'].split(',') });
//             })
//             .on('end', () => resolve(products))
//             .on('error', (err) => reject(err));
//     });
// };

exports.uploadFile = async (req, res, next) => {
    try {
        console.log("Received file:", req.file);
        
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const requestId = uuidv4();
        console.log("Generated requestId:", requestId);

        const products = await processCsv(req.file.path, requestId);
        console.log("Parsed CSV products:", products);

        await db.Request.create({ id: requestId, status: 'pending' });
        for (let product of products) {
            const productEntry = await db.Product.create({ request_id: requestId, name: product.name });
            for (let url of product.imageUrls) {
                await db.Image.create({ product_id: productEntry.id, input_url: url });
                queue.add({ requestId, productId: productEntry.id, imageUrl: url });
            }
        }

        res.json({ requestId });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        next(error);
    }
};