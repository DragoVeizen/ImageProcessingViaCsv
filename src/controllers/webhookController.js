// Webhook Controller
exports.handleWebhook = async (req, res, next) => {
    try {
        const { requestId } = req.body;
        if (!requestId) {
            return res.status(400).json({ error: 'Missing requestId' });
        }

        const request = await db.Request.findByPk(requestId, {
            include: [{ model: db.Product, include: [db.Image] }]
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const response = {
            requestId: request.id,
            status: request.status,
            products: request.Products.map(product => ({
                name: product.name,
                images: product.Images.map(image => ({
                    input_url: image.input_url,
                    output_url: image.output_url
                }))
            }))
        };

        console.log('Webhook triggered:', response);
        
        // If status is completed, download the CSV
        if (request.status === 'completed') {
            const csvPath = path.join(__dirname, `../uploads/output-${requestId}.csv`);
            const localDownloadPath = path.join(__dirname, `../downloads/output-${requestId}.csv`);
            fs.copyFileSync(csvPath, localDownloadPath);
            console.log(`CSV downloaded to: ${localDownloadPath}`);
        }
        
        res.json(response);
    } catch (error) {
        next(error);
    }
};