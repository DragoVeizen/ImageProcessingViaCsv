const Queue = require('bull');
const { processImage } = require('./imageProcessor');
const queue = new Queue('image-processing');
queue.process(async (job) => {
    return await processImage(job.data.imageUrl, job.data.productId);
});
exports.queue = queue;