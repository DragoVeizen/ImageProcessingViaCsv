const fs = require('fs');
const csv = require('csv-parser');

exports.processCsv = (filePath, requestId) => {
    return new Promise((resolve, reject) => {
        const products = {};
        let headers = [];

        fs.createReadStream(filePath)
            .pipe(require('csv-parser')({ headers: false, skipLines: 1, trim: true }))
            .on('data', (row) => {
                const values = Object.values(row);
                if (values.length < 3) {
                    console.warn('Skipping invalid row:', row);
                    return;
                }
                
                const productName = values[1].trim();
                const imageUrls = values.slice(2).map(url => url.trim());

                if (!products[productName]) {
                    products[productName] = { name: productName, imageUrls: [] };
                }

                products[productName].imageUrls.push(...imageUrls);
            })
            .on('end', () => resolve(Object.values(products)))
            .on('error', (err) => reject(err));
    });
};
